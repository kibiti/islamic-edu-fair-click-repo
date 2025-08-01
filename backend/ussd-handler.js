// ====================================================================
// USSD REGISTRATION SYSTEM - BACKEND INTEGRATION
// Islamic Education Fair Registration via *386*55#
// Developer: Hassan Natembea Kibiti
// GitHub Repository: https://github.com/kibiti/islamic-education-fair-ussd
// ====================================================================

// ussd-handler.js - USSD Session Management
class USSDRegistrationSystem {
    constructor() {
        this.config = {
            ussdCode: "*386*55#",
            sessionTimeout: 300000, // 5 minutes
            maxAttempts: 3,
            eventDate: "2024-09-14",
            eventName: "Kenya Islamic Education Fair",
            venue: "Kenya Muslim Academy, Park Road, Nairobi"
        };
        
        this.sessions = new Map();
        this.registrations = [];
        this.schools = this.loadSchools();
        
        this.init();
    }
    
    init() {
        console.log("USSD Registration System Initialized");
        this.setupSessionCleanup();
    }
    
    // Main USSD request handler
    handleUSSDRequest(phoneNumber, text, sessionId) {
        const session = this.getOrCreateSession(phoneNumber, sessionId);
        
        if (text === '') {
            // Initial request
            return this.showMainMenu(session);
        }
        
        const textArray = text.split('*');
        const lastInput = textArray[textArray.length - 1];
        const currentStep = textArray.length;
        
        return this.processStep(session, currentStep, lastInput, textArray);
    }
    
    getOrCreateSession(phoneNumber, sessionId) {
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, {
                id: sessionId,
                phoneNumber: phoneNumber,
                startTime: new Date(),
                step: 0,
                data: {},
                attempts: 0
            });
        }
        return this.sessions.get(sessionId);
    }
    
    showMainMenu(session) {
        session.step = 1;
        return {
            response: `CON Welcome to Kenya Islamic Education Fair Registration
            
📅 September 14th, 2024
📍 Kenya Muslim Academy, Nairobi

Choose option:
1. Student Registration
2. Teacher/Chaperone Registration  
3. Event Information
4. Contact Us
0. Exit`,
            continueSession: true
        };
    }
    
    processStep(session, step, input, fullInput) {
        session.step = step;
        
        switch(step) {
            case 2:
                return this.handleMainMenuSelection(session, input);
            case 3:
                return this.handleRegistrationType(session, input, fullInput);
            case 4:
                return this.handlePersonalInfo(session, input, fullInput);
            case 5:
                return this.handleSchoolSelection(session, input, fullInput);
            case 6:
                return this.handleFinalConfirmation(session, input, fullInput);
            default:
                return this.handleError(session, "Invalid session step");
        }
    }
    
    handleMainMenuSelection(session, input) {
        switch(input) {
            case '1':
                session.data.registrationType = 'student';
                return this.showStudentRegistration(session);
            case '2':
                session.data.registrationType = 'teacher';
                return this.showTeacherRegistration(session);
            case '3':
                return this.showEventInformation(session);
            case '4':
                return this.showContactInformation(session);
            case '0':
                return this.exitSession(session);
            default:
                return this.handleInvalidInput(session, this.showMainMenu(session));
        }
    }
    
    showStudentRegistration(session) {
        return {
            response: `CON Student Registration
            
Please enter your full name:
(Example: Ahmed Mohamed Ali)`,
            continueSession: true
        };
    }
    
    showTeacherRegistration(session) {
        return {
            response: `CON Teacher/Chaperone Registration
            
Please enter your full name:
(Example: Fatima Hassan Mohamed)`,
            continueSession: true
        };
    }
    
    handlePersonalInfo(session, input, fullInput) {
        if (fullInput[1] === '1' || fullInput[1] === '2') {
            if (input.trim().length < 3) {
                return this.handleInvalidInput(session, {
                    response: `CON Invalid name. Please enter your full name:
(Minimum 3 characters)`,
                    continueSession: true
                });
            }
            
            session.data.fullName = input.trim();
            return this.showSchoolSelection(session);
        }
        
        return this.handleError(session, "Invalid registration flow");
    }
    
    showSchoolSelection(session) {
        const schoolList = this.schools.slice(0, 9).map((school, index) => 
            `${index + 1}. ${school.name}`
        ).join('\n');
        
        return {
            response: `CON Select your school:

${schoolList}
0. My school is not listed`,
            continueSession: true
        };
    }
    
    handleSchoolSelection(session, input, fullInput) {
        const schoolIndex = parseInt(input) - 1;
        
        if (input === '0') {
            return this.showCustomSchoolInput(session);
        }
        
        if (schoolIndex >= 0 && schoolIndex < this.schools.length) {
            session.data.school = this.schools[schoolIndex];
            return this.showRegistrationSummary(session);
        }
        
        return this.handleInvalidInput(session, this.showSchoolSelection(session));
    }
    
    showCustomSchoolInput(session) {
        return {
            response: `CON Enter your school name:
(Please type the full name of your school)`,
            continueSession: true
        };
    }
    
    showRegistrationSummary(session) {
        const registrationType = session.data.registrationType === 'student' ? 'Student' : 'Teacher/Chaperone';
        const schoolName = session.data.school ? session.data.school.name : session.data.customSchool;
        
        return {
            response: `CON Registration Summary:

Name: ${session.data.fullName}
Type: ${registrationType}
School: ${schoolName}
Phone: ${session.phoneNumber}

Event: Kenya Islamic Education Fair
Date: September 14th, 2024
Venue: Kenya Muslim Academy, Nairobi

1. Confirm Registration
2. Edit Information
0. Cancel`,
            continueSession: true
        };
    }
    
    handleFinalConfirmation(session, input, fullInput) {
        switch(input) {
            case '1':
                return this.confirmRegistration(session);
            case '2':
                return this.showMainMenu(session);
            case '0':
                return this.exitSession(session);
            default:
                return this.handleInvalidInput(session, this.showRegistrationSummary(session));
        }
    }
    
    confirmRegistration(session) {
        const registration = {
            id: this.generateRegistrationId(),
            phoneNumber: session.phoneNumber,
            fullName: session.data.fullName,
            registrationType: session.data.registrationType,
            school: session.data.school || { name: session.data.customSchool },
            registrationDate: new Date(),
            status: 'confirmed',
            eventDate: this.config.eventDate
        };
        
        this.registrations.push(registration);
        this.saveRegistration(registration);
        this.sendConfirmationSMS(registration);
        
        return {
            response: `END Registration Successful! ✅

Registration ID: ${registration.id}
Name: ${registration.fullName}
Event: Kenya Islamic Education Fair
Date: September 14th, 2024
Venue: Kenya Muslim Academy, Nairobi

A confirmation SMS will be sent shortly.
For inquiries: 0731838387

Thank you for registering!`,
            continueSession: false
        };
    }
    
    showEventInformation(session) {
        return {
            response: `END Kenya Islamic Education Fair

📅 Date: September 14th, 2024
🕘 Time: 9:00 AM - 2:00 PM
📍 Venue: Kenya Muslim Academy
     Park Road, Nairobi

🎓 15+ Islamic Universities
📚 Scholarship Information
🎯 Career Guidance
🆓 FREE Attendance

Registration: Dial *386*55#
Info: 0731838387

Thank you!`,
            continueSession: false
        };
    }
    
    showContactInformation(session) {
        return {
            response: `END Contact Information

Elimuhub Education Consultants
📧 elimuhubconsultant@gmail.com
📞 0731838387 / 0721922836

Office:
Muhoho Avenue, South C
P.O. Box 10765-00100, Nairobi

Hassan Natembea Kibiti - CEO

For event inquiries, call or WhatsApp:
0731838387

Thank you!`,
            continueSession: false
        };
    }
    
    handleInvalidInput(session, fallbackResponse) {
        session.attempts++;
        
        if (session.attempts >= this.config.maxAttempts) {
            return {
                response: `END Too many invalid attempts.
Please dial *386*55# to start again.

For assistance: 0731838387`,
                continueSession: false
            };
        }
        
        return {
            response: `CON Invalid input. Please try again.
(Attempt ${session.attempts}/${this.config.maxAttempts})

${fallbackResponse.response.replace('CON ', '')}`,
            continueSession: true
        };
    }
    
    handleError(session, errorMessage) {
        console.error(`USSD Error for session ${session.id}: ${errorMessage}`);
        return {
            response: `END System error occurred.
Please try again later.

For assistance: 0731838387`,
            continueSession: false
        };
    }
    
    exitSession(session) {
        this.sessions.delete(session.id);
        return {
            response: `END Thank you for your interest in the Kenya Islamic Education Fair.

To register later: Dial *386*55#
For information: 0731838387

Barakallahu feeki!`,
            continueSession: false
        };
    }
    
    // Utility methods
    generateRegistrationId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `KEF${timestamp}${random}`.toUpperCase();
    }
    
    saveRegistration(registration) {
        // Save to database
        // This would integrate with your database system
        console.log('Registration saved:', registration);
        
        // For demo purposes, store in local array
        // In production, save to database
        localStorage.setItem(`registration_${registration.id}`, JSON.stringify(registration));
    }
    
    sendConfirmationSMS(registration) {
        const message = `Dear ${registration.fullName},

Your registration for Kenya Islamic Education Fair is confirmed!

Registration ID: ${registration.id}
Date: September 14th, 2024
Venue: Kenya Muslim Academy, Nairobi
Time: 9:00 AM - 2:00 PM

Please bring this SMS as confirmation.

For inquiries: 0731838387
Elimuhub Education Consultants`;

        // Integration with SMS gateway would go here
        this.sendSMS(registration.phoneNumber, message);
    }
    
    sendSMS(phoneNumber, message) {
        // SMS Gateway integration
        console.log(`SMS to ${phoneNumber}: ${message}`);
        
        // Example integration with Africa's Talking SMS API
        // Replace with your actual SMS gateway
        /*
        const africastalking = require('africasting');
        africastalking.SMS.send({
            to: phoneNumber,
            message: message
        });
        */
    }
    
    loadSchools() {
        return [
            { id: 1, name: "Wamy High School", location: "South B, Nairobi" },
            { id: 2, name: "Kenya Muslim Academy", location: "Park Road, Nairobi" },
            { id: 3, name: "Nairobi Muslim Academy", location: "Eastleigh, Nairobi" },
            { id: 4, name: "Islamic Foundation Academy", location: "Parklands, Nairobi" },
            { id: 5, name: "Nakuru Islamic School", location: "Nakuru" },
            { id: 6, name: "Mombasa Islamic School", location: "Mombasa" },
            { id: 7, name: "Kisumu Islamic Academy", location: "Kisumu" },
            { id: 8, name: "Eldoret Muslim Institute", location: "Eldoret" },
            { id: 9, name: "Nyeri Islamic Academy", location: "Nyeri" }
        ];
    }
    
    setupSessionCleanup() {
        // Clean up expired sessions every 5 minutes
        setInterval(() => {
            const now = new Date();
            for (const [sessionId, session] of this.sessions.entries()) {
                if (now - session.startTime > this.config.sessionTimeout) {
                    this.sessions.delete(sessionId);
                    console.log(`Cleaned up expired session: ${sessionId}`);
                }
            }
        }, 300000); // 5 minutes
    }
    
    // Analytics methods
    getRegistrationStats() {
        const stats = {
            totalRegistrations: this.registrations.length,
            studentRegistrations: this.registrations.filter(r => r.registrationType === 'student').length,
            teacherRegistrations: this.registrations.filter(r => r.registrationType === 'teacher').length,
            schoolBreakdown: {},
            hourlyRegistrations: {}
        };
        
        // School breakdown
        this.registrations.forEach(reg => {
            const schoolName = reg.school.name;
            stats.schoolBreakdown[schoolName] = (stats.schoolBreakdown[schoolName] || 0) + 1;
        });
        
        // Hourly registration breakdown
        this.registrations.forEach(reg => {
            const hour = reg.registrationDate.getHours();
            stats.hourlyRegistrations[hour] = (stats.hourlyRegistrations[hour] || 0) + 1;
        });
        
        return stats;
    }
    
    exportRegistrations(format = 'json') {
        switch(format) {
            case 'csv':
                return this.exportToCSV();
            case 'excel':
                return this.exportToExcel();
            default:
                return JSON.stringify(this.registrations, null, 2);
        }
    }
    
    exportToCSV() {
        const headers = ['Registration ID', 'Full Name', 'Phone Number', 'Type', 'School', 'Registration Date'];
        const rows = this.registrations.map(reg => [
            reg.id,
            reg.fullName,
            reg.phoneNumber,
            reg.registrationType,
            reg.school.name,
            reg.registrationDate.toISOString()
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
}

// Express.js integration for webhook handling
class USSDWebhookHandler {
    constructor(ussdSystem) {
        this.ussdSystem = ussdSystem;
    }
    
    // Africa's Talking webhook handler
    handleAfricasTalkingWebhook(req, res) {
        const { sessionId, phoneNumber, text } = req.body;
        
        try {
            const result = this.ussdSystem.handleUSSDRequest(phoneNumber, text, sessionId);
            
            res.setHeader('Content-Type', 'text/plain');
            res.send(result.response);
        } catch (error) {
            console.error('USSD Webhook Error:', error);
            res.setHeader('Content-Type', 'text/plain');
            res.send('END System error. Please try again later.');
        }
    }
    
    // Generic webhook handler for other USSD gateways
    handleGenericWebhook(req, res) {
        // Adapt based on your USSD gateway's request format
        const { session_id, phone_number, text } = req.body;
        
        try {
            const result = this.ussdSystem.handleUSSDRequest(phone_number, text, session_id);
            
            res.json({
                response: result.response,
                continue_session: result.continueSession
            });
        } catch (error) {
            console.error('USSD Webhook Error:', error);
            res.json({
                response: 'END System error. Please try again later.',
                continue_session: false
            });
        }
    }
}

// Database integration
class RegistrationDatabase {
    constructor() {
        this.connectionString = process.env.DATABASE_URL || 'sqlite:./registrations.db';
        this.init();
    }
    
    init() {
        // Initialize database connection
        // Example with SQLite
        /*
        const sqlite3 = require('sqlite3').verbose();
        this.db = new sqlite3.Database('./registrations.db');
        
        this.db.run(`
            CREATE TABLE IF NOT EXISTS registrations (
                id TEXT PRIMARY KEY,
                phone_number TEXT NOT NULL,
                full_name TEXT NOT NULL,
                registration_type TEXT NOT NULL,
                school_name TEXT NOT NULL,
                registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'confirmed'
            )
        `);
        */
    }
    
    saveRegistration(registration) {
        // Save to database
        /*
        const stmt = this.db.prepare(`
            INSERT INTO registrations 
            (id, phone_number, full_name, registration_type, school_name, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
            registration.id,
            registration.phoneNumber,
            registration.fullName,
            registration.registrationType,
            registration.school.name,
            registration.status
        ]);
        */
    }
    
    getRegistrationById(id) {
        // Retrieve registration by ID
        return new Promise((resolve, reject) => {
            /*
            this.db.get(
                'SELECT * FROM registrations WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
            */
        });
    }
    
    getAllRegistrations() {
        // Get all registrations
        return new Promise((resolve, reject) => {
            /*
            this.db.all(
                'SELECT * FROM registrations ORDER BY registration_date DESC',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
            */
        });
    }
}

// Export modules
module.exports = {
    USSDRegistrationSystem,
    USSDWebhookHandler,
    RegistrationDatabase
};

// Example usage for testing
if (require.main === module) {
    const ussdSystem = new USSDRegistrationSystem();
    
    // Test USSD flow
    console.log("Testing USSD Registration System...");
    
    // Simulate USSD requests
    const testPhoneNumber = "+254712345678";
    const testSessionId = "test_session_123";
    
    // Initial request
    let result = ussdSystem.handleUSSDRequest(testPhoneNumber, "", testSessionId);
    console.log("Step 1:", result.response);
    
    // Select student registration
    result = ussdSystem.handleUSSDRequest(testPhoneNumber, "1", testSessionId);
    console.log("Step 2:", result.response);
    
    // Enter name
    result = ussdSystem.handleUSSDRequest(testPhoneNumber, "1*Ahmed Mohamed Ali", testSessionId);
    console.log("Step 3:", result.response);
    
    // Select school
    result = ussdSystem.handleUSSDRequest(testPhoneNumber, "1*Ahmed Mohamed Ali*1", testSessionId);
    console.log("Step 4:", result.response);
    
    // Confirm registration
    result = ussdSystem.handleUSSDRequest(testPhoneNumber, "1*Ahmed Mohamed Ali*1*1", testSessionId);
    console.log("Step 5:", result.response);
    
    console.log("\nRegistration Stats:", ussdSystem.getRegistrationStats());
}
