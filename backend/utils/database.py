"""
Database connection utilities for PostgreSQL and MongoDB
"""
import os
import logging
from contextlib import contextmanager
import psycopg2
from psycopg2.extras import RealDictCursor
from pymongo import MongoClient
import redis
from elasticsearch import Elasticsearch

logger = logging.getLogger(__name__)

class DatabaseManager:
    """Centralized database connection manager"""
    
    def __init__(self):
        self.pg_pool = None
        self.mongo_client = None
        self.redis_client = None
        self.es_client = None
        self._initialize_connections()
    
    def _initialize_connections(self):
        """Initialize all database connections"""
        try:
            # PostgreSQL connection
            self.pg_config = {
                'host': os.getenv('POSTGRES_HOST', 'localhost'),
                'port': os.getenv('POSTGRES_PORT', '5432'),
                'database': os.getenv('POSTGRES_DB', 'ecom_chatbot'),
                'user': os.getenv('POSTGRES_USER', 'postgres'),
                'password': os.getenv('POSTGRES_PASSWORD', 'password')
            }
            
            # MongoDB connection
            mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/ecom_chatbot')
            self.mongo_client = MongoClient(mongo_uri)
            self.mongo_db = self.mongo_client.get_default_database()
            
            # Redis connection
            redis_host = os.getenv('REDIS_HOST', 'localhost')
            redis_port = int(os.getenv('REDIS_PORT', '6379'))
            redis_password = os.getenv('REDIS_PASSWORD', None)
            self.redis_client = redis.Redis(
                host=redis_host,
                port=redis_port,
                password=redis_password,
                decode_responses=True
            )
            
            # Elasticsearch connection
            es_host = os.getenv('ELASTICSEARCH_HOST', 'localhost:9200')
            self.es_client = Elasticsearch([es_host])
            
            logger.info("Database connections initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize database connections: {e}")
            raise
    
    @contextmanager
    def get_pg_connection(self):
        """Get PostgreSQL connection with automatic cleanup"""
        conn = None
        try:
            conn = psycopg2.connect(**self.pg_config)
            yield conn
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"PostgreSQL connection error: {e}")
            raise
        finally:
            if conn:
                conn.close()
    
    @contextmanager
    def get_pg_cursor(self, commit=True):
        """Get PostgreSQL cursor with automatic transaction handling"""
        with self.get_pg_connection() as conn:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            try:
                yield cursor
                if commit:
                    conn.commit()
            except Exception as e:
                conn.rollback()
                logger.error(f"PostgreSQL cursor error: {e}")
                raise
            finally:
                cursor.close()
    
    def get_mongo_collection(self, collection_name):
        """Get MongoDB collection"""
        return self.mongo_db[collection_name]
    
    def get_redis_client(self):
        """Get Redis client"""
        return self.redis_client
    
    def get_es_client(self):
        """Get Elasticsearch client"""
        return self.es_client
    
    def health_check(self):
        """Check health of all database connections"""
        health_status = {
            'postgresql': False,
            'mongodb': False,
            'redis': False,
            'elasticsearch': False
        }
        
        # PostgreSQL health check
        try:
            with self.get_pg_cursor() as cursor:
                cursor.execute("SELECT 1")
                health_status['postgresql'] = True
        except Exception as e:
            logger.error(f"PostgreSQL health check failed: {e}")
        
        # MongoDB health check
        try:
            self.mongo_client.admin.command('ping')
            health_status['mongodb'] = True
        except Exception as e:
            logger.error(f"MongoDB health check failed: {e}")
        
        # Redis health check
        try:
            self.redis_client.ping()
            health_status['redis'] = True
        except Exception as e:
            logger.error(f"Redis health check failed: {e}")
        
        # Elasticsearch health check
        try:
            self.es_client.ping()
            health_status['elasticsearch'] = True
        except Exception as e:
            logger.error(f"Elasticsearch health check failed: {e}")
        
        return health_status

# Global database manager instance
db_manager = DatabaseManager()
