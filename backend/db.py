# import os
# def get_db_connection():
#     return mysql.connector.connect(
#         host=os.getenv("localhost"),      # localhost
#         user=os.getenv("root"),      # root
#         password=os.getenv("bd12"),  # bd12
#         database=os.getenv("Fitcooker")   # Fitcooker
#     )

import sqlite3
import os

def get_db_connection():
    conn = sqlite3.connect('fitcooker.sql')
    conn.row_factory = sqlite3.Row
    return conn