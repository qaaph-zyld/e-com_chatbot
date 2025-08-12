"""
Order model and database operations
"""
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
from decimal import Decimal
from backend.utils.database import db_manager
import logging

logger = logging.getLogger(__name__)

class Order:
    """Order model with database operations"""
    
    def __init__(self, order_id=None, user_id=None, status='pending',
                 total_amount=None, shipping_address=None, billing_address=None,
                 payment_method=None, payment_status='pending',
                 created_at=None, updated_at=None, metadata=None):
        self.order_id = order_id or str(uuid.uuid4())
        self.user_id = user_id
        self.status = status  # pending, confirmed, processing, shipped, delivered, cancelled
        self.total_amount = total_amount
        self.shipping_address = shipping_address or {}
        self.billing_address = billing_address or {}
        self.payment_method = payment_method
        self.payment_status = payment_status  # pending, paid, failed, refunded
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        self.metadata = metadata or {}
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert order to dictionary"""
        return {
            'order_id': self.order_id,
            'user_id': self.user_id,
            'status': self.status,
            'total_amount': float(self.total_amount) if self.total_amount else None,
            'shipping_address': self.shipping_address,
            'billing_address': self.billing_address,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'metadata': self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Order':
        """Create Order instance from dictionary"""
        return cls(
            order_id=data.get('order_id'),
            user_id=data.get('user_id'),
            status=data.get('status', 'pending'),
            total_amount=data.get('total_amount'),
            shipping_address=data.get('shipping_address', {}),
            billing_address=data.get('billing_address', {}),
            payment_method=data.get('payment_method'),
            payment_status=data.get('payment_status', 'pending'),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None,
            updated_at=datetime.fromisoformat(data['updated_at']) if data.get('updated_at') else None,
            metadata=data.get('metadata', {})
        )
    
    def save(self) -> bool:
        """Save order to database"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                # Check if order exists
                cursor.execute("SELECT order_id FROM orders WHERE order_id = %s", (self.order_id,))
                exists = cursor.fetchone()
                
                if exists:
                    # Update existing order
                    self.updated_at = datetime.utcnow()
                    cursor.execute("""
                        UPDATE orders SET 
                            user_id = %s, status = %s, total_amount = %s,
                            shipping_address = %s, billing_address = %s,
                            payment_method = %s, payment_status = %s,
                            updated_at = %s, metadata = %s
                        WHERE order_id = %s
                    """, (
                        self.user_id, self.status, self.total_amount,
                        self.shipping_address, self.billing_address,
                        self.payment_method, self.payment_status,
                        self.updated_at, self.metadata, self.order_id
                    ))
                else:
                    # Insert new order
                    cursor.execute("""
                        INSERT INTO orders (
                            order_id, user_id, status, total_amount,
                            shipping_address, billing_address, payment_method,
                            payment_status, created_at, updated_at, metadata
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        self.order_id, self.user_id, self.status, self.total_amount,
                        self.shipping_address, self.billing_address, self.payment_method,
                        self.payment_status, self.created_at, self.updated_at, self.metadata
                    ))
                
                logger.info(f"Order {self.order_id} saved successfully")
                return True
                
        except Exception as e:
            logger.error(f"Failed to save order {self.order_id}: {e}")
            return False
    
    @classmethod
    def find_by_id(cls, order_id: str) -> Optional['Order']:
        """Find order by ID"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("SELECT * FROM orders WHERE order_id = %s", (order_id,))
                row = cursor.fetchone()
                
                if row:
                    return cls.from_dict(dict(row))
                return None
                
        except Exception as e:
            logger.error(f"Failed to find order by ID {order_id}: {e}")
            return None
    
    @classmethod
    def find_by_user_id(cls, user_id: str, limit: int = 20, offset: int = 0) -> List['Order']:
        """Find orders by user ID"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM orders 
                    WHERE user_id = %s 
                    ORDER BY created_at DESC 
                    LIMIT %s OFFSET %s
                """, (user_id, limit, offset))
                rows = cursor.fetchall()
                
                return [cls.from_dict(dict(row)) for row in rows]
                
        except Exception as e:
            logger.error(f"Failed to find orders for user {user_id}: {e}")
            return []

class OrderItem:
    """Order item model with database operations"""
    
    def __init__(self, item_id=None, order_id=None, product_id=None,
                 quantity=1, unit_price=None, total_price=None,
                 created_at=None):
        self.item_id = item_id or str(uuid.uuid4())
        self.order_id = order_id
        self.product_id = product_id
        self.quantity = quantity
        self.unit_price = unit_price
        self.total_price = total_price or (unit_price * quantity if unit_price else None)
        self.created_at = created_at or datetime.utcnow()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert order item to dictionary"""
        return {
            'item_id': self.item_id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price) if self.unit_price else None,
            'total_price': float(self.total_price) if self.total_price else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'OrderItem':
        """Create OrderItem instance from dictionary"""
        return cls(
            item_id=data.get('item_id'),
            order_id=data.get('order_id'),
            product_id=data.get('product_id'),
            quantity=data.get('quantity', 1),
            unit_price=data.get('unit_price'),
            total_price=data.get('total_price'),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None
        )
    
    def save(self) -> bool:
        """Save order item to database"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("""
                    INSERT INTO order_items (
                        item_id, order_id, product_id, quantity,
                        unit_price, total_price, created_at
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (item_id) DO UPDATE SET
                        quantity = EXCLUDED.quantity,
                        unit_price = EXCLUDED.unit_price,
                        total_price = EXCLUDED.total_price
                """, (
                    self.item_id, self.order_id, self.product_id,
                    self.quantity, self.unit_price, self.total_price,
                    self.created_at
                ))
                
                logger.info(f"Order item {self.item_id} saved successfully")
                return True
                
        except Exception as e:
            logger.error(f"Failed to save order item {self.item_id}: {e}")
            return False
    
    @classmethod
    def find_by_order_id(cls, order_id: str) -> List['OrderItem']:
        """Find order items by order ID"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM order_items 
                    WHERE order_id = %s 
                    ORDER BY created_at ASC
                """, (order_id,))
                rows = cursor.fetchall()
                
                return [cls.from_dict(dict(row)) for row in rows]
                
        except Exception as e:
            logger.error(f"Failed to find order items for order {order_id}: {e}")
            return []
