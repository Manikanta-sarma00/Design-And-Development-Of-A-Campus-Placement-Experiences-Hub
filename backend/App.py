# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_bcrypt import Bcrypt
# import mysql.connector
# from mysql.connector import Error
# import jwt
# import datetime
# from functools import wraps

# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'your-secret-key-change-in-production-env'
# CORS(app)
# bcrypt = Bcrypt(app)

# # Database Configuration
# DB_CONFIG = {
#     'host': 'localhost',
#     'user': 'root',
#     'password': 'Sri@1316',
#     'database': 'placement_hub'
# }

# # ==================== Database Connection ====================
# def get_db_connection():
#     """Create and return a database connection"""
#     try:
#         connection = mysql.connector.connect(**DB_CONFIG)
#         return connection
#     except Error as e:
#         print(f"❌ Database connection error: {e}")
#         return None

# # ==================== Token Authentication ====================
# def token_required(f):
#     """Decorator to verify JWT token"""
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         token = request.headers.get('Authorization')
        
#         if not token:
#             return jsonify({'error': 'Token is missing'}), 401
        
#         try:
#             if token.startswith('Bearer '):
#                 token = token.split(' ')[1]
#             data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
#             current_user_id = data['user_id']
#         except jwt.ExpiredSignatureError:
#             return jsonify({'error': 'Token has expired'}), 401
#         except jwt.InvalidTokenError:
#             return jsonify({'error': 'Token is invalid'}), 401
#         except Exception as e:
#             return jsonify({'error': f'Authentication error: {str(e)}'}), 401
        
#         return f(current_user_id, *args, **kwargs)
    
#     return decorated

# # ==================== Authentication Endpoints ====================

# @app.route('/api/register', methods=['POST'])
# def register():
#     """Register a new user"""
#     try:
#         data = request.get_json()
        
#         required_fields = ['fullName', 'email', 'password']
#         if not all(field in data for field in required_fields):
#             return jsonify({'error': 'Missing required fields'}), 400
        
#         if len(data['password']) < 6:
#             return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
#         if '@' not in data['email']:
#             return jsonify({'error': 'Invalid email format'}), 400
        
#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500
        
#         cursor = connection.cursor(dictionary=True)
        
#         cursor.execute("SELECT id FROM users WHERE email = %s", (data['email'],))
#         if cursor.fetchone():
#             cursor.close()
#             connection.close()
#             return jsonify({'error': 'Email already registered'}), 409
        
#         hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
#         query = """
#             INSERT INTO users (full_name, email, college, department, password)
#             VALUES (%s, %s, %s, %s, %s)
#         """
#         values = (
#             data['fullName'],
#             data['email'],
#             data.get('college', ''),
#             data.get('department', ''),
#             hashed_password
#         )
        
#         cursor.execute(query, values)
#         connection.commit()
        
#         cursor.close()
#         connection.close()
        
#         return jsonify({
#             'message': 'Registration successful',
#             'success': True
#         }), 201
        
#     except Error as e:
#         print(f"Database error: {e}")
#         return jsonify({'error': f'Database error: {str(e)}'}), 500
#     except Exception as e:
#         print(f"Server error: {e}")
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

# @app.route('/api/login', methods=['POST'])
# def login():
#     """Login user and return token"""
#     try:
#         data = request.get_json()

#         email = data.get('email')
#         password = data.get('password')

#         if not email or not password:
#             return jsonify({'error': 'Email and password required'}), 400

#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500

#         cursor = connection.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
#         user = cursor.fetchone()

#         cursor.close()
#         connection.close()

#         if user and bcrypt.check_password_hash(user['password'], password):
#             token = jwt.encode(
#                 {
#                     'user_id': user['id'],
#                     'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
#                 },
#                 app.config['SECRET_KEY'],
#                 algorithm="HS256"
#             )

#             return jsonify({
#                 'token': token,
#                 'user': {
#                     'id': user['id'],
#                     'fullName': user['full_name'],
#                     'email': user['email'],
#                     'college': user.get('college', ''),
#                     'department': user.get('department', '')
#                 }
#             }), 200
#         else:
#             return jsonify({'error': 'Invalid email or password'}), 401

#     except Exception as e:
#         print("Login error:", e)
#         return jsonify({'error': 'Server error'}), 500

# # ==================== Experience Endpoints ====================

# @app.route('/api/experiences', methods=['GET'])
# def get_experiences():
#     """Get all placement experiences"""
#     try:
#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500
        
#         cursor = connection.cursor(dictionary=True)
        
#         query = """
#             SELECT 
#                 id, company, role, student_name, college, department, 
#                 academic_year, ctc, rounds, difficulty, rating, 
#                 experience, likes, views, date, created_at
#             FROM experiences
#             ORDER BY date DESC, created_at DESC
#         """
        
#         cursor.execute(query)
#         experiences = cursor.fetchall()
        
#         for exp in experiences:
#             if exp.get('date'):
#                 exp['date'] = exp['date'].isoformat()
#             if exp.get('created_at'):
#                 exp['created_at'] = exp['created_at'].isoformat()
        
#         cursor.close()
#         connection.close()
        
#         return jsonify(experiences), 200
        
#     except Error as e:
#         return jsonify({'error': f'Database error: {str(e)}'}), 500
#     except Exception as e:
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

# @app.route('/api/experiences', methods=['POST'])
# @token_required
# def add_experience(current_user_id):
#     """Add a new placement experience"""
#     try:
#         data = request.get_json()
        
#         required_fields = [
#             'company', 'role', 'student_name', 'college', 'department',
#             'academic_year', 'ctc', 'rounds', 'difficulty', 'rating', 'experience'
#         ]
        
#         missing_fields = [field for field in required_fields if field not in data]
#         if missing_fields:
#             return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
        
#         try:
#             rounds = int(data['rounds'])
#             rating = int(data['rating'])
            
#             if rounds < 1 or rounds > 10:
#                 return jsonify({'error': 'Rounds must be between 1 and 10'}), 400
            
#             if rating < 1 or rating > 5:
#                 return jsonify({'error': 'Rating must be between 1 and 5'}), 400
                
#         except ValueError:
#             return jsonify({'error': 'Invalid number format for rounds or rating'}), 400
        
#         if data['difficulty'] not in ['Easy', 'Medium', 'Hard']:
#             return jsonify({'error': 'Difficulty must be Easy, Medium, or Hard'}), 400
        
#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500
        
#         cursor = connection.cursor()
        
#         query = """
#             INSERT INTO experiences 
#             (company, role, student_name, college, department, academic_year, 
#              ctc, rounds, difficulty, rating, experience, likes, views)
#             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 0, 0)
#         """
        
#         values = (
#             data['company'],
#             data['role'],
#             data['student_name'],
#             data['college'],
#             data['department'],
#             data['academic_year'],
#             data['ctc'],
#             rounds,
#             data['difficulty'],
#             rating,
#             data['experience']
#         )
        
#         cursor.execute(query, values)
#         connection.commit()
#         experience_id = cursor.lastrowid
        
#         update_company_stats(connection, data['company'])
        
#         cursor.close()
#         connection.close()
        
#         return jsonify({
#             'message': 'Experience added successfully',
#             'id': experience_id,
#             'success': True
#         }), 201
        
#     except Error as e:
#         return jsonify({'error': f'Database error: {str(e)}'}), 500
#     except Exception as e:
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

# @app.route('/api/experiences/<int:id>/like', methods=['POST'])
# def like_experience(id):
#     """Increment likes for an experience"""
#     try:
#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500
        
#         cursor = connection.cursor()
        
#         cursor.execute("SELECT id FROM experiences WHERE id = %s", (id,))
#         if not cursor.fetchone():
#             cursor.close()
#             connection.close()
#             return jsonify({'error': 'Experience not found'}), 404
        
#         cursor.execute("UPDATE experiences SET likes = likes + 1 WHERE id = %s", (id,))
#         connection.commit()
        
#         cursor.execute("SELECT likes FROM experiences WHERE id = %s", (id,))
#         result = cursor.fetchone()
        
#         cursor.close()
#         connection.close()
        
#         return jsonify({
#             'message': 'Experience liked successfully',
#             'likes': result[0] if result else 0
#         }), 200
        
#     except Error as e:
#         return jsonify({'error': f'Database error: {str(e)}'}), 500
#     except Exception as e:
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

# @app.route('/api/experiences/<int:id>/view', methods=['POST'])
# def view_experience(id):
#     """Increment views for an experience"""
#     try:
#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500
        
#         cursor = connection.cursor()
        
#         cursor.execute("UPDATE experiences SET views = views + 1 WHERE id = %s", (id,))
#         connection.commit()
        
#         cursor.close()
#         connection.close()
        
#         return jsonify({'message': 'View recorded'}), 200
        
#     except Error as e:
#         return jsonify({'error': f'Database error: {str(e)}'}), 500
#     except Exception as e:
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

# # ==================== Company Endpoints ====================

# @app.route('/api/companies', methods=['GET'])
# def get_companies():
#     """Get all companies"""
#     try:
#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500
        
#         cursor = connection.cursor(dictionary=True)
        
#         query = """
#             SELECT 
#                 id, name, description, avg_package, 
#                 avg_rating, total_reviews, website
#             FROM companies
#             ORDER BY name ASC
#         """
        
#         cursor.execute(query)
#         companies = cursor.fetchall()
        
#         cursor.close()
#         connection.close()
        
#         return jsonify(companies), 200
        
#     except Error as e:
#         return jsonify({'error': f'Database error: {str(e)}'}), 500
#     except Exception as e:
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

# def update_company_stats(connection, company_name):
#     """Update company statistics based on experiences"""
#     try:
#         cursor = connection.cursor(dictionary=True)
        
#         query = """
#             SELECT 
#                 COUNT(*) as total_reviews,
#                 AVG(rating) as avg_rating,
#                 AVG(CAST(SUBSTRING_INDEX(ctc, ' ', 1) AS DECIMAL(10,2))) as avg_ctc
#             FROM experiences
#             WHERE company = %s
#         """
        
#         cursor.execute(query, (company_name,))
#         stats = cursor.fetchone()
        
#         avg_package = f"{stats['avg_ctc']:.2f} LPA" if stats['avg_ctc'] else "N/A"
#         avg_rating = round(stats['avg_rating'], 2) if stats['avg_rating'] else 0.0
        
#         cursor.execute("SELECT id FROM companies WHERE name = %s", (company_name,))
#         company_exists = cursor.fetchone()
        
#         if company_exists:
#             update_query = """
#                 UPDATE companies 
#                 SET avg_rating = %s, total_reviews = %s, avg_package = %s, updated_at = NOW()
#                 WHERE name = %s
#             """
#             cursor.execute(update_query, (avg_rating, stats['total_reviews'], avg_package, company_name))
#         else:
#             insert_query = """
#                 INSERT INTO companies (name, avg_rating, total_reviews, avg_package, description)
#                 VALUES (%s, %s, %s, %s, %s)
#             """
#             cursor.execute(insert_query, (
#                 company_name, 
#                 avg_rating, 
#                 stats['total_reviews'], 
#                 avg_package,
#                 f'Information about {company_name}'
#             ))
        
#         connection.commit()
#         cursor.close()
        
#     except Error as e:
#         print(f"❌ Error updating company stats: {e}")

# # ==================== META AI SEARCH ENDPOINTS ====================

# @app.route('/api/meta-ai/search', methods=['POST'])
# def meta_ai_search():
#     """Search for company information using database"""
#     try:
#         data = request.get_json()
#         company_name = data.get('company', '').strip()
        
#         if not company_name:
#             return jsonify({'error': 'Company name is required'}), 400
        
#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500
        
#         cursor = connection.cursor(dictionary=True)
        
#         # Search for exact or partial match
#         query = """
#             SELECT 
#                 e.company,
#                 e.role,
#                 e.student_name,
#                 e.college,
#                 e.department,
#                 e.academic_year,
#                 e.ctc,
#                 e.rounds,
#                 e.difficulty,
#                 e.rating,
#                 e.experience,
#                 e.likes,
#                 e.views,
#                 e.date,
#                 e.created_at
#             FROM experiences e
#             WHERE LOWER(e.company) LIKE LOWER(%s)
#             ORDER BY e.academic_year DESC, e.created_at DESC
#         """
        
#         cursor.execute(query, (f'%{company_name}%',))
#         experiences = cursor.fetchall()
        
#         if not experiences:
#             cursor.close()
#             connection.close()
#             return jsonify({
#                 'success': False,
#                 'message': f'Oops! No placement experiences found for "{company_name}"',
#                 'company': company_name,
#                 'data': None
#             }), 200
        
#         # Convert datetime objects
#         for exp in experiences:
#             if exp.get('date'):
#                 exp['date'] = exp['date'].isoformat()
#             if exp.get('created_at'):
#                 exp['created_at'] = exp['created_at'].isoformat()
        
#         # Get company statistics
#         stats_query = """
#             SELECT 
#                 COUNT(*) as total_placements,
#                 COUNT(DISTINCT academic_year) as years_active,
#                 AVG(rating) as avg_rating,
#                 AVG(CAST(SUBSTRING_INDEX(ctc, ' ', 1) AS DECIMAL(10,2))) as avg_package,
#                 MAX(CAST(SUBSTRING_INDEX(ctc, ' ', 1) AS DECIMAL(10,2))) as highest_package,
#                 MIN(academic_year) as first_year,
#                 MAX(academic_year) as last_year
#             FROM experiences
#             WHERE LOWER(company) LIKE LOWER(%s)
#         """
        
#         cursor.execute(stats_query, (f'%{company_name}%',))
#         stats = cursor.fetchone()
        
#         # Get year-wise breakdown
#         year_query = """
#             SELECT 
#                 academic_year,
#                 COUNT(*) as placements,
#                 AVG(rating) as avg_rating,
#                 AVG(CAST(SUBSTRING_INDEX(ctc, ' ', 1) AS DECIMAL(10,2))) as avg_package
#             FROM experiences
#             WHERE LOWER(company) LIKE LOWER(%s)
#             GROUP BY academic_year
#             ORDER BY academic_year DESC
#         """
        
#         cursor.execute(year_query, (f'%{company_name}%',))
#         year_breakdown = cursor.fetchall()
        
#         cursor.close()
#         connection.close()
        
#         # Prepare response
#         response_data = {
#             'success': True,
#             'message': f'Found {len(experiences)} placement experience(s) for "{company_name}"',
#             'company': experiences[0]['company'] if experiences else company_name,
#             'data': {
#                 'experiences': experiences,
#                 'statistics': {
#                     'total_placements': stats['total_placements'],
#                     'years_active': stats['years_active'],
#                     'avg_rating': round(stats['avg_rating'], 2) if stats['avg_rating'] else 0,
#                     'avg_package': f"{stats['avg_package']:.2f} LPA" if stats['avg_package'] else "N/A",
#                     'highest_package': f"{stats['highest_package']:.2f} LPA" if stats['highest_package'] else "N/A",
#                     'year_range': f"{stats['first_year']} - {stats['last_year']}" if stats['first_year'] else "N/A"
#                 },
#                 'year_breakdown': [
#                     {
#                         'year': year['academic_year'],
#                         'placements': year['placements'],
#                         'avg_rating': round(year['avg_rating'], 2) if year['avg_rating'] else 0,
#                         'avg_package': f"{year['avg_package']:.2f} LPA" if year['avg_package'] else "N/A"
#                     }
#                     for year in year_breakdown
#                 ]
#             }
#         }
        
#         return jsonify(response_data), 200
        
#     except Error as e:
#         print(f"Database error: {e}")
#         return jsonify({'error': f'Database error: {str(e)}'}), 500
#     except Exception as e:
#         print(f"Server error: {e}")
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

# @app.route('/api/meta-ai/companies/list', methods=['GET'])
# def get_all_company_names():
#     """Get list of all unique companies for autocomplete"""
#     try:
#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500
        
#         cursor = connection.cursor(dictionary=True)
        
#         query = """
#             SELECT DISTINCT company, COUNT(*) as count
#             FROM experiences
#             GROUP BY company
#             ORDER BY count DESC, company ASC
#         """
        
#         cursor.execute(query)
#         companies = cursor.fetchall()
        
#         cursor.close()
#         connection.close()
        
#         return jsonify({
#             'companies': [{'name': c['company'], 'count': c['count']} for c in companies]
#         }), 200
        
#     except Error as e:
#         return jsonify({'error': f'Database error: {str(e)}'}), 500
#     except Exception as e:
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

# # ==================== Statistics Endpoints ====================

# @app.route('/api/stats', methods=['GET'])
# def get_stats():
#     """Get overall statistics"""
#     try:
#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500
        
#         cursor = connection.cursor(dictionary=True)
        
#         query = """
#             SELECT 
#                 COUNT(*) as total_experiences,
#                 COUNT(DISTINCT company) as total_companies,
#                 COUNT(DISTINCT student_name) as total_students,
#                 CONCAT(ROUND(AVG(CAST(SUBSTRING_INDEX(ctc, ' ', 1) AS DECIMAL(10,2))), 2), ' LPA') as overall_avg_package
#             FROM experiences
#         """
        
#         cursor.execute(query)
#         stats = cursor.fetchone()
        
#         cursor.close()
#         connection.close()
        
#         return jsonify(stats), 200
        
#     except Error as e:
#         return jsonify({'error': f'Database error: {str(e)}'}), 500
#     except Exception as e:
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

# @app.route('/api/stats/by-year', methods=['GET'])
# def get_year_stats():
#     """Get year-wise statistics"""
#     try:
#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500
        
#         cursor = connection.cursor(dictionary=True)
        
#         query = """
#             SELECT 
#                 academic_year as year,
#                 COUNT(*) as total_placements,
#                 COUNT(DISTINCT company) as companies_count,
#                 CONCAT(ROUND(AVG(CAST(SUBSTRING_INDEX(ctc, ' ', 1) AS DECIMAL(10,2))), 2), ' LPA') as avg_package,
#                 CONCAT(MAX(CAST(SUBSTRING_INDEX(ctc, ' ', 1) AS DECIMAL(10,2))), ' LPA') as highest_package
#             FROM experiences
#             GROUP BY academic_year
#             ORDER BY academic_year DESC
#         """
        
#         cursor.execute(query)
#         stats = cursor.fetchall()
        
#         cursor.close()
#         connection.close()
        
#         return jsonify(stats), 200
        
#     except Error as e:
#         return jsonify({'error': f'Database error: {str(e)}'}), 500
#     except Exception as e:
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

# @app.route('/api/stats/by-department', methods=['GET'])
# def get_department_stats():
#     """Get department-wise statistics"""
#     try:
#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500
        
#         cursor = connection.cursor(dictionary=True)
        
#         query = """
#             SELECT 
#                 department,
#                 COUNT(*) as total_placements,
#                 COUNT(DISTINCT student_name) as students_placed,
#                 COUNT(DISTINCT company) as companies_count,
#                 CONCAT(ROUND(AVG(CAST(SUBSTRING_INDEX(ctc, ' ', 1) AS DECIMAL(10,2))), 2), ' LPA') as avg_package,
#                 CONCAT(MAX(CAST(SUBSTRING_INDEX(ctc, ' ', 1) AS DECIMAL(10,2))), ' LPA') as highest_package
#             FROM experiences
#             WHERE department IS NOT NULL AND department != ''
#             GROUP BY department
#             ORDER BY total_placements DESC
#         """
        
#         cursor.execute(query)
#         stats = cursor.fetchall()
        
#         cursor.close()
#         connection.close()
        
#         return jsonify(stats), 200
        
#     except Error as e:
#         return jsonify({'error': f'Database error: {str(e)}'}), 500
#     except Exception as e:
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

# # ==================== Success Stories Endpoints ====================

# @app.route('/api/success-stories', methods=['GET'])
# def get_success_stories():
#     """Get all success stories"""
#     try:
#         connection = get_db_connection()
#         if not connection:
#             return jsonify({'error': 'Database connection failed'}), 500
        
#         cursor = connection.cursor(dictionary=True)
        
#         query = """
#             SELECT 
#                 id, student_name, company, package, college, 
#                 branch, story, created_at
#             FROM success_stories
#             ORDER BY created_at DESC
#         """
        
#         cursor.execute(query)
#         stories = cursor.fetchall()
        
#         for story in stories:
#             if story.get('created_at'):
#                 story['created_at'] = story['created_at'].isoformat()
        
#         cursor.close()
#         connection.close()
        
#         return jsonify(stories), 200
        
#     except Error as e:
#         return jsonify({'error': f'Database error: {str(e)}'}), 500
#     except Exception as e:
#         return jsonify({'error': f'Server error: {str(e)}'}), 500

# # ==================== Health Check & Info ====================

# @app.route('/api/health', methods=['GET'])
# def health_check():
#     """API health check endpoint"""
#     return jsonify({
#         'status': 'healthy',
#         'message': 'Placement Hub API is running',
#         'version': '1.0.0',
#         'timestamp': datetime.datetime.now().isoformat()
#     }), 200

# @app.route('/', methods=['GET'])
# def index():
#     """Root endpoint"""
#     return jsonify({
#         'message': 'Welcome to Placement Hub API',
#         'version': '1.0.0',
#         'endpoints': {
#             'auth': ['/api/register', '/api/login'],
#             'experiences': ['/api/experiences', '/api/experiences/<id>/like'],
#             'companies': ['/api/companies'],
#             'stats': ['/api/stats', '/api/stats/by-year', '/api/stats/by-department'],
#             'stories': ['/api/success-stories'],
#             'meta_ai': ['/api/meta-ai/search', '/api/meta-ai/companies/list']
#         }
#     }), 200

# # ==================== Error Handlers ====================

# @app.errorhandler(404)
# def not_found(error):
#     """Handle 404 errors"""
#     return jsonify({'error': 'Endpoint not found'}), 404

# @app.errorhandler(500)
# def internal_error(error):
#     """Handle 500 errors"""
#     return jsonify({'error': 'Internal server error'}), 500

# @app.errorhandler(405)
# def method_not_allowed(error):
#     """Handle 405 errors"""
#     return jsonify({'error': 'Method not allowed'}), 405

# # ==================== Main ====================

# if __name__ == '__main__':
#     print("\n" + "="*60)
#     print("🚀 Starting Placement Hub Backend Server")
#     print("="*60)
#     print(f"📍 Server running at: http://localhost:5000")
#     print(f"📊 API Base URL: http://localhost:5000/api")
#     print("\n📝 Available Endpoints:")
#     print("   Authentication:")
#     print("   - POST   /api/register          (Register new user)")
#     print("   - POST   /api/login             (Login user)")
#     print("\n   Experiences:")
#     print("   - GET    /api/experiences       (Get all experiences)")
#     print("   - POST   /api/experiences       (Add new experience - requires auth)")
#     print("   - POST   /api/experiences/<id>/like  (Like experience)")
#     print("   - POST   /api/experiences/<id>/view  (View experience)")
#     print("\n   Companies:")
#     print("   - GET    /api/companies         (Get all companies)")
#     print("\n   Meta AI Search:")
#     print("   - POST   /api/meta-ai/search    (Search company info)")
#     print("   - GET    /api/meta-ai/companies/list  (Get company list)")
#     print("\n   Statistics:")
#     print("   - GET    /api/stats             (Overall statistics)")
#     print("   - GET    /api/stats/by-year     (Year-wise statistics)")
#     print("   - GET    /api/stats/by-department  (Department-wise stats)")
#     print("\n   Success Stories:")
#     print("   - GET    /api/success-stories   (Get success stories)")
#     print("\n   Utility:")
#     print("   - GET    /api/health            (Health check)")
#     print("="*60)
#     print("✅ Server is ready to accept requests!")
#     print("="*60 + "\n")
    
#     app.run(debug=True, host='0.0.0.0', port=5000)
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import mysql.connector
from mysql.connector import Error
import jwt
import datetime
import os
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production-env'
CORS(app)
bcrypt = Bcrypt(app)

# ─── Database Config ──────────────────────────────────────────
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Sri@1316',   # ← your MySQL password
    'database': 'placement_hub'
}

# ─── Admin Credentials ────────────────────────────────────────
ADMIN_USERNAME = 'admin'       # ← change this to your preferred admin username
ADMIN_PASSWORD = 'admin123'    # ← change this to your preferred admin password
ADMIN_SECRET   = 'admin-secret-key-change-me'


# ══════════════════════════════════════════════════════════════
# DATABASE
# ══════════════════════════════════════════════════════════════
def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Database error: {e}")
        return None


# ══════════════════════════════════════════════════════════════
# TOKEN DECORATORS
# ══════════════════════════════════════════════════════════════
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        except Exception as e:
            return jsonify({'error': f'Auth error: {str(e)}'}), 401
        return f(current_user_id, *args, **kwargs)
    return decorated


def admin_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Admin token missing'}), 401
        try:
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            data = jwt.decode(token, ADMIN_SECRET, algorithms=["HS256"])
            if data.get('role') != 'admin':
                return jsonify({'error': 'Not an admin token'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token invalid'}), 401
        return f(*args, **kwargs)
    return decorated


# ══════════════════════════════════════════════════════════════
# SERVE ADMIN PANEL PAGE
# ══════════════════════════════════════════════════════════════
@app.route('/admin')
def admin_page():
    return send_file('admin_panel.html')


# ══════════════════════════════════════════════════════════════
# AUTH ROUTES
# ══════════════════════════════════════════════════════════════
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        required_fields = ['fullName', 'email', 'password', 'rollNumber']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        # ✅ Email must be @bvcgroup.in
        if not data['email'].endswith('@bvcgroup.in'):
            return jsonify({'error': 'Only @bvcgroup.in college email addresses are allowed'}), 400

        # ✅ Roll number validation
        roll = data['rollNumber'].strip().upper()

        # Must be exactly 10 characters
        if len(roll) != 10:
            return jsonify({'error': 'Roll number must be exactly 10 characters'}), 400

        # Position 1 & 2 must be digits (regulation year)
        if not roll[0:2].isdigit():
            return jsonify({'error': 'Roll number must be wrong'}), 400

        # Position 3 & 4 must be college code '22'
        if roll[2:4] != '22':
            return jsonify({'error': 'Invalid roll number — college code must be 22'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor(dictionary=True)

        # Check email already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (data['email'],))
        if cursor.fetchone():
            cursor.close(); connection.close()
            return jsonify({'error': 'Email already registered'}), 409

        # Check roll number already exists
        cursor.execute("SELECT id FROM users WHERE roll_number = %s", (roll,))
        if cursor.fetchone():
            cursor.close(); connection.close()
            return jsonify({'error': 'Roll number already registered'}), 409

        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        cursor.execute(
            "INSERT INTO users (full_name, email, college, department, password, roll_number) VALUES (%s,%s,%s,%s,%s,%s)",
            (data['fullName'], data['email'], data.get('college',''), data.get('department',''), hashed_password, roll)
        )
        connection.commit()
        cursor.close(); connection.close()
        return jsonify({'message': 'Registration successful', 'success': True}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        # ✅ Email must be @bvcgroup.in
        if not email.endswith('@bvcgroup.in'):
            return jsonify({'error': 'Only @bvcgroup.in college email addresses are allowed'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close(); connection.close()

        if user and bcrypt.check_password_hash(user['password'], password):
            token = jwt.encode(
                {'user_id': user['id'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)},
                app.config['SECRET_KEY'], algorithm="HS256"
            )
            return jsonify({
                'token': token,
                'user': {
                    'id': user['id'],
                    'fullName': user['full_name'],
                    'email': user['email'],
                    'college': user.get('college',''),
                    'department': user.get('department',''),
                    'rollNumber': user.get('roll_number','')
                }
            }), 200
        return jsonify({'error': 'Invalid email or password'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500
# ══════════════════════════════════════════════════════════════
# EXPERIENCE ROUTES
# ══════════════════════════════════════════════════════════════
@app.route('/api/experiences', methods=['GET'])
def get_experiences():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, company, role, student_name, college, department,
                   academic_year, ctc, rounds, difficulty, rating,
                   experience, likes, views, date, created_at
            FROM experiences ORDER BY date DESC, created_at DESC
        """)
        experiences = cursor.fetchall()
        for exp in experiences:
            if exp.get('date'): exp['date'] = exp['date'].isoformat()
            if exp.get('created_at'): exp['created_at'] = exp['created_at'].isoformat()
        cursor.close(); connection.close()
        return jsonify(experiences), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/experiences', methods=['POST'])
@token_required
def add_experience(current_user_id):
    try:
        data = request.get_json()
        required_fields = ['company','role','student_name','college','department',
                           'academic_year','ctc','rounds','difficulty','rating','experience']
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({'error': f'Missing: {", ".join(missing)}'}), 400

        rounds = int(data['rounds'])
        rating = int(data['rating'])
        if not (1 <= rounds <= 10): return jsonify({'error': 'Rounds must be 1–10'}), 400
        if not (1 <= rating <= 5):  return jsonify({'error': 'Rating must be 1–5'}), 400
        if data['difficulty'] not in ['Easy','Medium','Hard']:
            return jsonify({'error': 'Difficulty must be Easy, Medium, or Hard'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO experiences
            (company,role,student_name,college,department,academic_year,ctc,rounds,difficulty,rating,experience,likes,views)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,0,0)
        """, (data['company'],data['role'],data['student_name'],data['college'],
              data['department'],data['academic_year'],data['ctc'],
              rounds,data['difficulty'],rating,data['experience']))
        connection.commit()
        exp_id = cursor.lastrowid
        update_company_stats(connection, data['company'])
        cursor.close(); connection.close()
        return jsonify({'message': 'Experience added successfully', 'id': exp_id, 'success': True}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/experiences/<int:id>/like', methods=['POST'])
def like_experience(id):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor()
        cursor.execute("SELECT id FROM experiences WHERE id = %s", (id,))
        if not cursor.fetchone():
            cursor.close(); connection.close()
            return jsonify({'error': 'Experience not found'}), 404
        cursor.execute("UPDATE experiences SET likes = likes + 1 WHERE id = %s", (id,))
        connection.commit()
        cursor.execute("SELECT likes FROM experiences WHERE id = %s", (id,))
        result = cursor.fetchone()
        cursor.close(); connection.close()
        return jsonify({'message': 'Liked', 'likes': result[0] if result else 0}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/experiences/<int:id>/view', methods=['POST'])
def view_experience(id):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor()
        cursor.execute("UPDATE experiences SET views = views + 1 WHERE id = %s", (id,))
        connection.commit()
        cursor.close(); connection.close()
        return jsonify({'message': 'View recorded'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ══════════════════════════════════════════════════════════════
# COMPANY ROUTES
# ══════════════════════════════════════════════════════════════
@app.route('/api/companies', methods=['GET'])
def get_companies():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, name, description, avg_package, avg_rating, total_reviews, website FROM companies ORDER BY name ASC")
        companies = cursor.fetchall()
        cursor.close(); connection.close()
        return jsonify(companies), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def update_company_stats(connection, company_name):
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT COUNT(*) as total_reviews, AVG(rating) as avg_rating,
                   AVG(CAST(SUBSTRING_INDEX(ctc,' ',1) AS DECIMAL(10,2))) as avg_ctc
            FROM experiences WHERE company = %s
        """, (company_name,))
        stats = cursor.fetchone()
        avg_package = f"{stats['avg_ctc']:.2f} LPA" if stats['avg_ctc'] else "N/A"
        avg_rating  = round(stats['avg_rating'], 2)  if stats['avg_rating']  else 0.0
        cursor.execute("SELECT id FROM companies WHERE name = %s", (company_name,))
        if cursor.fetchone():
            cursor.execute("UPDATE companies SET avg_rating=%s, total_reviews=%s, avg_package=%s, updated_at=NOW() WHERE name=%s",
                           (avg_rating, stats['total_reviews'], avg_package, company_name))
        else:
            cursor.execute("INSERT INTO companies (name, avg_rating, total_reviews, avg_package, description) VALUES (%s,%s,%s,%s,%s)",
                           (company_name, avg_rating, stats['total_reviews'], avg_package, f'Info about {company_name}'))
        connection.commit()
        cursor.close()
    except Error as e:
        print(f"Company stats error: {e}")


# ══════════════════════════════════════════════════════════════
# STATS ROUTES
# ══════════════════════════════════════════════════════════════
@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT COUNT(*) as total_experiences,
                   COUNT(DISTINCT company) as total_companies,
                   COUNT(DISTINCT student_name) as total_students,
                   CONCAT(ROUND(AVG(CAST(SUBSTRING_INDEX(ctc,' ',1) AS DECIMAL(10,2))),2),' LPA') as overall_avg_package
            FROM experiences
        """)
        stats = cursor.fetchone()
        cursor.close(); connection.close()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/stats/by-year', methods=['GET'])
def get_year_stats():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT academic_year as year, COUNT(*) as total_placements,
                   COUNT(DISTINCT company) as companies_count,
                   CONCAT(ROUND(AVG(CAST(SUBSTRING_INDEX(ctc,' ',1) AS DECIMAL(10,2))),2),' LPA') as avg_package,
                   CONCAT(MAX(CAST(SUBSTRING_INDEX(ctc,' ',1) AS DECIMAL(10,2))),' LPA') as highest_package
            FROM experiences GROUP BY academic_year ORDER BY academic_year DESC
        """)
        stats = cursor.fetchall()
        cursor.close(); connection.close()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/stats/by-department', methods=['GET'])
def get_department_stats():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT department, COUNT(*) as total_placements,
                   COUNT(DISTINCT student_name) as students_placed,
                   COUNT(DISTINCT company) as companies_count,
                   CONCAT(ROUND(AVG(CAST(SUBSTRING_INDEX(ctc,' ',1) AS DECIMAL(10,2))),2),' LPA') as avg_package,
                   CONCAT(MAX(CAST(SUBSTRING_INDEX(ctc,' ',1) AS DECIMAL(10,2))),' LPA') as highest_package
            FROM experiences WHERE department IS NOT NULL AND department != ''
            GROUP BY department ORDER BY total_placements DESC
        """)
        stats = cursor.fetchall()
        cursor.close(); connection.close()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ══════════════════════════════════════════════════════════════
# SUCCESS STORIES ROUTES
# ══════════════════════════════════════════════════════════════
@app.route('/api/success-stories', methods=['GET'])
def get_success_stories():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, student_name, company, package, college, branch, story, created_at FROM success_stories ORDER BY created_at DESC")
        stories = cursor.fetchall()
        for s in stories:
            if s.get('created_at'): s['created_at'] = s['created_at'].isoformat()
        cursor.close(); connection.close()
        return jsonify(stories), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ══════════════════════════════════════════════════════════════
# ADMIN ROUTES  ←  NEW SECTION
# ══════════════════════════════════════════════════════════════

# 1. Admin Login
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        if data.get('username') != ADMIN_USERNAME or data.get('password') != ADMIN_PASSWORD:
            return jsonify({'error': 'Wrong username or password'}), 401
        token = jwt.encode(
            {'role': 'admin', 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)},
            ADMIN_SECRET, algorithm='HS256'
        )
        return jsonify({'token': token}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 2. Get All Users
@app.route('/api/admin/users', methods=['GET'])
@admin_token_required
def admin_get_users():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, full_name, email, college, department, created_at FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        for u in users:
            if u.get('created_at'): u['created_at'] = u['created_at'].isoformat()
        cursor.close(); connection.close()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 3. Delete User
@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@admin_token_required
def admin_delete_user(user_id):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor()
        cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
        if not cursor.fetchone():
            cursor.close(); connection.close()
            return jsonify({'error': 'User not found'}), 404
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        connection.commit()
        cursor.close(); connection.close()
        return jsonify({'message': 'User deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 4. Delete Experience
@app.route('/api/admin/experiences/<int:exp_id>', methods=['DELETE'])
@admin_token_required
def admin_delete_experience(exp_id):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT company FROM experiences WHERE id = %s", (exp_id,))
        row = cursor.fetchone()
        if not row:
            cursor.close(); connection.close()
            return jsonify({'error': 'Experience not found'}), 404
        cursor.execute("DELETE FROM experiences WHERE id = %s", (exp_id,))
        connection.commit()
        update_company_stats(connection, row['company'])
        cursor.close(); connection.close()
        return jsonify({'message': 'Experience deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 5. Delete Company
@app.route('/api/admin/companies/<int:company_id>', methods=['DELETE'])
@admin_token_required
def admin_delete_company(company_id):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor()
        cursor.execute("SELECT id FROM companies WHERE id = %s", (company_id,))
        if not cursor.fetchone():
            cursor.close(); connection.close()
            return jsonify({'error': 'Company not found'}), 404
        cursor.execute("DELETE FROM companies WHERE id = %s", (company_id,))
        connection.commit()
        cursor.close(); connection.close()
        return jsonify({'message': 'Company deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 6. Add Success Story (admin)
@app.route('/api/admin/success-stories', methods=['POST'])
@admin_token_required
def admin_add_story():
    try:
        data = request.get_json()
        required = ['student_name','company','package','college','branch','story']
        missing = [f for f in required if not data.get(f)]
        if missing:
            return jsonify({'error': f'Missing: {", ".join(missing)}'}), 400
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO success_stories (student_name, company, package, college, branch, story) VALUES (%s,%s,%s,%s,%s,%s)",
            (data['student_name'], data['company'], data['package'], data['college'], data['branch'], data['story'])
        )
        connection.commit()
        new_id = cursor.lastrowid
        cursor.close(); connection.close()
        return jsonify({'message': 'Story added', 'id': new_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 7. Admin Add Experience (saves to same experiences table — shows to students)
@app.route('/api/admin/experiences', methods=['POST'])
@admin_token_required
def admin_add_experience():
    try:
        data = request.get_json()
        required_fields = ['company','role','student_name','college','department',
                           'academic_year','ctc','rounds','difficulty','rating','experience']
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({'error': f'Missing: {", ".join(missing)}'}), 400

        rounds = int(data['rounds'])
        rating = int(data['rating'])
        if not (1 <= rounds <= 10): return jsonify({'error': 'Rounds must be 1–10'}), 400
        if not (1 <= rating <= 5):  return jsonify({'error': 'Rating must be 1–5'}), 400
        if data['difficulty'] not in ['Easy','Medium','Hard']:
            return jsonify({'error': 'Difficulty must be Easy, Medium, or Hard'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO experiences
            (company,role,student_name,college,department,academic_year,ctc,rounds,difficulty,rating,experience,likes,views)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,0,0)
        """, (data['company'],data['role'],data['student_name'],data['college'],
              data['department'],data['academic_year'],data['ctc'],
              rounds,data['difficulty'],rating,data['experience']))
        connection.commit()
        exp_id = cursor.lastrowid
        update_company_stats(connection, data['company'])
        cursor.close(); connection.close()
        return jsonify({'message': 'Experience added successfully', 'id': exp_id, 'success': True}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 8. Delete Success Story
@app.route('/api/admin/success-stories/<int:story_id>', methods=['DELETE'])
@admin_token_required
def admin_delete_story(story_id):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        cursor = connection.cursor()
        cursor.execute("SELECT id FROM success_stories WHERE id = %s", (story_id,))
        if not cursor.fetchone():
            cursor.close(); connection.close()
            return jsonify({'error': 'Story not found'}), 404
        cursor.execute("DELETE FROM success_stories WHERE id = %s", (story_id,))
        connection.commit()
        cursor.close(); connection.close()
        return jsonify({'message': 'Story deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ══════════════════════════════════════════════════════════════
# HEALTH CHECK
# ══════════════════════════════════════════════════════════════
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'API is running'}), 200


@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'Welcome to Placement Hub API'}), 200


# ══════════════════════════════════════════════════════════════
# ERROR HANDLERS
# ══════════════════════════════════════════════════════════════
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# ══════════════════════════════════════════════════════════════
# RUN
# ══════════════════════════════════════════════════════════════
if __name__ == '__main__':
    print("\n====================================")
    print("  Placement Hub Backend Starting...")
    print("====================================")
    print("  Student App API → http://localhost:5000/api")
    print("  Admin Panel     → http://localhost:5000/admin")
    print("====================================\n")
    app.run(debug=True, host='0.0.0.0', port=5000)