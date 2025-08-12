"""
Product model and database operations
"""
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
from backend.utils.database import db_manager
import logging

logger = logging.getLogger(__name__)

class Product:
    """Product model with database operations"""
    
    def __init__(self, product_id=None, name=None, description=None, price=None,
                 category=None, brand=None, sku=None, stock_quantity=0,
                 images=None, specifications=None, is_active=True,
                 created_at=None, updated_at=None):
        self.product_id = product_id or str(uuid.uuid4())
        self.name = name
        self.description = description
        self.price = price
        self.category = category
        self.brand = brand
        self.sku = sku
        self.stock_quantity = stock_quantity
        self.images = images or []
        self.specifications = specifications or {}
        self.is_active = is_active
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert product to dictionary"""
        return {
            'product_id': self.product_id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price) if self.price else None,
            'category': self.category,
            'brand': self.brand,
            'sku': self.sku,
            'stock_quantity': self.stock_quantity,
            'images': self.images,
            'specifications': self.specifications,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Product':
        """Create Product instance from dictionary"""
        return cls(
            product_id=data.get('product_id'),
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
            category=data.get('category'),
            brand=data.get('brand'),
            sku=data.get('sku'),
            stock_quantity=data.get('stock_quantity', 0),
            images=data.get('images', []),
            specifications=data.get('specifications', {}),
            is_active=data.get('is_active', True),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None,
            updated_at=datetime.fromisoformat(data['updated_at']) if data.get('updated_at') else None
        )
    
    def save(self) -> bool:
        """Save product to database"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                # Check if product exists
                cursor.execute("SELECT product_id FROM products WHERE product_id = %s", (self.product_id,))
                exists = cursor.fetchone()
                
                if exists:
                    # Update existing product
                    self.updated_at = datetime.utcnow()
                    cursor.execute("""
                        UPDATE products SET 
                            name = %s, description = %s, price = %s, category = %s,
                            brand = %s, sku = %s, stock_quantity = %s, images = %s,
                            specifications = %s, is_active = %s, updated_at = %s
                        WHERE product_id = %s
                    """, (
                        self.name, self.description, self.price, self.category,
                        self.brand, self.sku, self.stock_quantity, self.images,
                        self.specifications, self.is_active, self.updated_at,
                        self.product_id
                    ))
                else:
                    # Insert new product
                    cursor.execute("""
                        INSERT INTO products (
                            product_id, name, description, price, category,
                            brand, sku, stock_quantity, images, specifications,
                            is_active, created_at, updated_at
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        self.product_id, self.name, self.description, self.price,
                        self.category, self.brand, self.sku, self.stock_quantity,
                        self.images, self.specifications, self.is_active,
                        self.created_at, self.updated_at
                    ))
                
                logger.info(f"Product {self.product_id} saved successfully")
                return True
                
        except Exception as e:
            logger.error(f"Failed to save product {self.product_id}: {e}")
            return False
    
    @classmethod
    def find_by_id(cls, product_id: str) -> Optional['Product']:
        """Find product by ID"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("SELECT * FROM products WHERE product_id = %s AND is_active = true", (product_id,))
                row = cursor.fetchone()
                
                if row:
                    return cls.from_dict(dict(row))
                return None
                
        except Exception as e:
            logger.error(f"Failed to find product by ID {product_id}: {e}")
            return None
    
    @classmethod
    def search(cls, query: str = None, category: str = None, brand: str = None,
               min_price: float = None, max_price: float = None,
               limit: int = 20, offset: int = 0) -> List['Product']:
        """Search products with filters"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                conditions = ["is_active = true"]
                params = []
                
                if query:
                    conditions.append("(name ILIKE %s OR description ILIKE %s)")
                    params.extend([f"%{query}%", f"%{query}%"])
                
                if category:
                    conditions.append("category = %s")
                    params.append(category)
                
                if brand:
                    conditions.append("brand = %s")
                    params.append(brand)
                
                if min_price is not None:
                    conditions.append("price >= %s")
                    params.append(min_price)
                
                if max_price is not None:
                    conditions.append("price <= %s")
                    params.append(max_price)
                
                where_clause = " AND ".join(conditions)
                params.extend([limit, offset])
                
                cursor.execute(f"""
                    SELECT * FROM products 
                    WHERE {where_clause}
                    ORDER BY updated_at DESC
                    LIMIT %s OFFSET %s
                """, params)
                
                rows = cursor.fetchall()
                return [cls.from_dict(dict(row)) for row in rows]
                
        except Exception as e:
            logger.error(f"Failed to search products: {e}")
            return []
    
    @classmethod
    def get_categories(cls) -> List[str]:
        """Get all product categories"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("""
                    SELECT DISTINCT category FROM products 
                    WHERE is_active = true AND category IS NOT NULL
                    ORDER BY category
                """)
                rows = cursor.fetchall()
                return [row['category'] for row in rows]
                
        except Exception as e:
            logger.error(f"Failed to get categories: {e}")
            return []
    
    @classmethod
    def get_recommendations(cls, product_id: str = None, user_id: str = None,
                          limit: int = 5) -> List['Product']:
        """Get product recommendations (simplified algorithm)"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                if product_id:
                    # Get products from same category
                    cursor.execute("""
                        SELECT p2.* FROM products p1
                        JOIN products p2 ON p1.category = p2.category
                        WHERE p1.product_id = %s AND p2.product_id != %s
                        AND p2.is_active = true
                        ORDER BY p2.updated_at DESC
                        LIMIT %s
                    """, (product_id, product_id, limit))
                else:
                    # Get popular products (by stock quantity as proxy)
                    cursor.execute("""
                        SELECT * FROM products 
                        WHERE is_active = true
                        ORDER BY stock_quantity DESC, updated_at DESC
                        LIMIT %s
                    """, (limit,))
                
                rows = cursor.fetchall()
                return [cls.from_dict(dict(row)) for row in rows]
                
        except Exception as e:
            logger.error(f"Failed to get recommendations: {e}")
            return []
    
    def update_stock(self, quantity_change: int) -> bool:
        """Update stock quantity"""
        try:
            new_quantity = self.stock_quantity + quantity_change
            if new_quantity < 0:
                logger.warning(f"Cannot reduce stock below 0 for product {self.product_id}")
                return False
            
            self.stock_quantity = new_quantity
            return self.save()
            
        except Exception as e:
            logger.error(f"Failed to update stock for product {self.product_id}: {e}")
            return False
