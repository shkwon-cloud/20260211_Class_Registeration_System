import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# DB 접속 정보
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "mysql1234")
DB_NAME = os.getenv("DB_NAME", "class_registration")

def initialize_db():
    # 1. 데이터베이스 생성 (먼저 연결 후 생성)
    try:
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS
        )
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
            print(f"Database '{DB_NAME}' created or already exists.")
        connection.close()
    except Exception as e:
        print(f"Error creating database: {e}")
        return

    # 2. 테이블 생성 (SQL 파일 읽어서 실행)
    try:
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME
        )
        with connection.cursor() as cursor:
            with open("init.sql", "r", encoding="utf-8") as f:
                sql_commands = f.read().split(";")
                for command in sql_commands:
                    if command.strip():
                        cursor.execute(command)
            connection.commit()
            print("Tables created successfully.")
        connection.close()
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == "__main__":
    initialize_db()
