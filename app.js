class GradingSystem {
    constructor() {
        this.assignments = [];
        this.students = [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
            { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
            { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com' }
        ];
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                const action = e.target.dataset.action;
                this[action](e);
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.handleInputChange(e);
            }
        });
    }

    handleInputChange(e) {
        const target = e.target;
        const row = target.closest('tr');
        const studentId = parseInt(row.dataset.studentId);
        const assignmentId = parseInt(row.dataset.assignmentId);

        if (target.name === 'score') {
            const score = parseFloat(target.value) || 0;
            const maxScore = parseFloat(target.dataset.maxScore);
            const percentage = maxScore > 0 ? (score / maxScore * 100) : 0;
            
            // Update percentage cell
            const percentageCell = row.querySelector('.percentage');
            percentageCell.textContent = percentage.toFixed(1) + '%';
            percentageCell.className = `percentage px-2 py-1 rounded text-xs font-medium ${
                percentage >= 90 ? 'bg-green-100 text-green-800' :
                percentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
            }`;

            // Update total
            this.updateStudentTotal(studentId);
        }
    }

    addAssignment() {
        const name = document.getElementById('assignment-name').value.trim();
        const maxScore = parseFloat(document.getElementById('max-score').value) || 100;
        
        if (!name) {
            this.showNotification('Assignment name is required!', 'error');
            return;
        }

        const assignment = {
            id: Date.now(),
            name,
            maxScore,
            submissions: {}
        };

        this.assignments.unshift(assignment);
        document.getElementById('assignment-name').value = '';
        document.getElementById('max-score').value = '100';
        this.render();
        this.showNotification('Assignment added successfully!', 'success');
    }

    addStudent() {
        const name = document.getElementById('student-name').value.trim();
        const email = document.getElementById('student-email').value.trim();
        
        if (!name || !email) {
            this.showNotification('Student name and email are required!', 'error');
            return;
        }

        const student = {
            id: Date.now(),
            name,
            email
        };

        this.students.unshift(student);
        document.getElementById('student-name').value = '';
        document.getElementById('student-email').value = '';
        this.render();
        this.showNotification('Student added successfully!', 'success');
    }

    deleteAssignment(assignmentId) {
        this.assignments = this.assignments.filter(a => a.id !== assignmentId);
        this.render();
        this.showNotification('Assignment deleted!', 'warning');
    }

    deleteStudent(studentId) {
        this.students = this.students.filter(s => s.id !== studentId);
        this.render();
        this.showNotification('Student deleted!', 'warning');
    }

    updateStudentTotal(studentId) {
        const row = document.querySelector(`[data-student-id="${studentId}"]`);
        if (!row) return;

        let totalScore = 0;
        let totalMaxScore = 0;
        const scoreInputs = row.querySelectorAll('input[name="score"]');
        
        scoreInputs.forEach(input => {
            const score = parseFloat(input.value) || 0;
            const maxScore = parseFloat(input.dataset.maxScore);
            totalScore += score;
            totalMaxScore += maxScore;
        });

        const average = totalMaxScore > 0 ? (totalScore / totalMaxScore * 100) : 0;
        const totalCell = row.querySelector('.total-score');
        totalCell.innerHTML = `
            <span class="font-bold">${average.toFixed(1)}%</span>
            <span class="text-xs text-gray-500 ml-1">(${totalScore.toFixed(1)}/${totalMaxScore})</span>
        `;
        
        const grade = this.getLetterGrade(average);
        totalCell.className = `total-score px-3 py-2 rounded-lg font-bold text-lg ${
            average >= 90 ? 'bg-green-100 text-green-800' :
            average >= 80 ? 'bg-blue-100 text-blue-800' :
            average >= 70 ? 'bg-yellow-100 text-yellow-800' :
            average >= 60 ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
        }`;
    }

    getLetterGrade(percentage) {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    }

    exportGrades() {
        const data = {
            students: this.students,
            assignments: this.assignments,
            generatedAt: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `grades-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Grades exported successfully!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    render() {
        document.getElementById('app').innerHTML = this.getHTML();
    }

    getHTML() {
        return `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <!-- Header -->
            <header class="bg-white shadow-lg border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center py-6">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">Automated Grading System</h1>
                            <p class="mt-1 text-sm text-gray-500">${this.students.length} students • ${this.assignments.length} assignments</p>
                        </div>
                        <button data-action="exportGrades" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium shadow-md transition-all duration-200">
                            📊 Export Grades
                        </button>
                    </div>
                </div>
            </header>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Add Assignment & Student -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">➕ Add Assignment</h2>
                        <div class="space-y-4">
                            <input id="assignment-name" type="text" placeholder="Assignment name" class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <input id="max-score" type="number" placeholder="Max score (e.g. 100)" class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" value="100">
                            <button data-action="addAssignment" class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 shadow-lg transition-all duration-200">
                                Add Assignment
                            </button>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">➕ Add Student</h2>
                        <div class="space-y-4">
                            <input id="student-name" type="text" placeholder="Student name" class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <input id="student-email" type="email" placeholder="student@example.com" class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <button data-action="addStudent" class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 shadow-lg transition-all duration-200">
                                Add Student
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Grades Table -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h2 class="text-2xl font-bold text-gray-900">📋 Gradebook</h2>
                    </div>
                    
                    ${this.students.length === 0 ? `
                    <div class="text-center py-12">
                        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">No students yet</h3>
                        <p class="text-gray-500 mb-4">Add students and assignments to get started</p>
                        <button data-action="addStudent" class="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600">
                            Add First Student
                        </button>
                    </div>
                    ` : `
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Student</th>
                                    ${this.assignments.map(assignment => `
                                        <th class="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="${assignment.name}">
                                            ${assignment.name.length > 12 ? assignment.name.substring(0,12) + '...' : assignment.name}
                                            <br><span class="text-xs text-gray-400">/ ${assignment.maxScore}</span>
                                        </th>
                                    `).join('')}
                                    <th class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th class="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${this.students.map(student => `
                                <tr class="hover:bg-gray-50 transition-colors" data-student-id="${student.id}">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                ${student.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                                            </div>
                                            <div class="ml-4">
                                                <div class="text-sm font-medium text-gray-900">${student.name}</div>
                                                <div class="text-xs text-gray-500">${student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    ${this.assignments.map(assignment => `
                                        <td class="px-2 py-4">
                                            <input 
                                                type="number" 
                                                name="score" 
                                                data-max-score="${assignment.maxScore}"
                                                value="${assignment.submissions[student.id] || ''}" 
                                                step="0.1" 
                                                min="0" 
                                                max="${assignment.maxScore}"
                                                class="w-20 mx-auto block p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                                                placeholder="0"
                                            >
                                            <div class="percentage text-xs text-center mt-1 px-1 bg-gray-50 rounded opacity-0">0%</div>
                                        </td>
                                    `).join('')}
                                    <td class="px-4 py-4 text-center">
                                        <div class="total-score px-3 py-2 rounded-lg bg-gray-100 text-gray-800 font-bold text-lg">
                                            Calculating...
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 whitespace-nowrap text-center text-sm">
                                        <button data-action="deleteStudent" data-student-id="${student.id}" 
                                            class="text-red-600 hover:text-red-900 p-1 -ml-1 rounded-full hover:bg-red-50 transition-colors">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    `}
                </div>

                <!-- Assignment Management -->
                ${this.assignments.length > 0 ? `
                <div class="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">📚 Current Assignments</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        ${this.assignments.map(assignment => `
                        <div class="group bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                            <div class="font-medium text-gray-900 mb-1">${assignment.name}</div>
                            <div class="text-sm text-gray-500 mb-2">Max: ${assignment.maxScore}</div>
                            <button data-action="deleteAssignment" data-assignment-id="${assignment.id}"
                                class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition-opacity">
                                Delete
                            </button>
                        </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
        `;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GradingSystem();
});
