# Automated-Grading-System-
Automatically grades student marks and produces the report cards 
# Automated Grading System

A complete intelligent system for automated grading of student submissions (code, essays, quizzes) with intelligent feedback, plagiarism detection, and analytics.

## ✨ Features

- **Multiple Submission Types**: Code, essays, quizzes, projects, exams
- **Automated Grading**: Instant evaluation for quizzes and assignments
- **Code Analysis**: Unit testing, code style checks, performance analysis
- **AI-Assisted Essay Grading**: Keyword matching and rubric-based scoring
- **Plagiarism Detection**: Similarity scoring and detection
- **Flexible Rubric System**: Custom rubrics with weighted criteria
- **Analytics Dashboard**: Grade distribution, student progress tracking
- **Role-Based Access**: Student, TA, and Instructor roles
- **File Management**: Upload multiple submission types

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Local Setup (Docker - Recommended)

```bash
# 1. Clone repository
git clone https://github.com/Aleckyvill/automated-grading-system.git
cd automated-grading-system

# 2. Copy environment file
cp config/development.env .env

# 3. Start with Docker Compose
docker-compose -f config/docker-compose.yml up -d

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
# RabbitMQ Admin: http://localhost:15672
