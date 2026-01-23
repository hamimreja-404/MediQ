# MediQ  
## Clinic & Healthcare Appointment Management SaaS (Private Project)

MediQ is a modern, cloud-based healthcare management platform designed to digitize small and medium-sized clinics. The system replaces manual appointment handling with a real-time, transparent, and efficient digital workflow for doctors, patients, and platform administrators.

This project is currently under active development and maintained as a **private SaaS codebase**.

---

## Overview

Small clinics often rely on phone calls and paper registers to manage appointments. This approach leads to operational inefficiencies, patient dissatisfaction, and unnecessary time loss for medical professionals.

MediQ addresses these challenges by introducing a unified digital platform that simplifies appointment booking, queue management, and clinic operations.

---

## Problem Statement

Traditional clinic workflows commonly result in:

- Long waiting times due to unmanaged queues  
- Missed or forgotten appointments caused by lack of reminders  
- Inefficient clinic operations and manual record keeping  
- Poor patient experience due to lack of transparency  

---

## Solution

MediQ provides a centralized SaaS platform that connects patients, doctors, and administrators through dedicated interfaces, ensuring a smooth and predictable healthcare experience.

---

## Platform Modules

### Doctor Portal (Clinic Admin)

- **Live Desk (Cockpit)**  
  Real-time queue management with options to call, skip, or recall patients.

- **Smart Appointment Scheduling**  
  Calendar-based slot management, holiday blocking, and walk-in handling.

- **E-Prescription System**  
  Generate professional digital prescriptions with reusable medicine templates.

- **Patient Database (CRM)**  
  Centralized patient history with visit records and medical notes.

- **Clinic Configuration**  
  Manage consultation fees, clinic timings, and staff access.

- **Analytics Dashboard**  
  Track revenue, patient count, and average waiting times.

---

### Patient Application (Mobile-First Web App)

- **Doctor Discovery**  
  Search doctors by specialization, clinic name, or location.

- **Instant Appointment Booking**  
  Real-time slot availability with quick booking flow.

- **Live Queue Tracking**  
  View current token status remotely to avoid unnecessary waiting.

- **Digital Health ID**  
  QR-code-based identity for quick clinic check-in.

- **Medical Records Locker**  
  Secure storage for prescriptions and uploaded lab reports.

- **WhatsApp Notifications**  
  Appointment confirmations and turn alerts via WhatsApp.

---

### Platform Admin (Super Admin)

- **Traffic Analytics**  
  Monitor daily visitors, unique users, and returning users.

- **Engagement Metrics**  
  Track session duration and user activity.

- **User Growth Monitoring**  
  Visual insights into registration and platform adoption trends.

---

## Technology Stack

### Frontend
- React.js  
- Tailwind CSS  
- Framer Motion  
- Lucide React  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB with Mongoose  

### Authentication
- JWT (JSON Web Tokens)  
- bcryptjs  

### Real-Time (Planned for V2)
- Socket.io  

---

## Version 1.0.0 (MVP Scope)

The initial release focuses on authentication, onboarding, and high-fidelity user interfaces.

### Implemented Features

#### Authentication & Onboarding
- Unified role-based login system  
- OTP-based patient registration (simulation)  
- Doctor onboarding with license and clinic details  

#### User Interface
- Public landing website with dark mode support  
- Multi-language support (English and Bengali)  
- Responsive patient and doctor dashboards  

#### Core Functional Logic
- Doctor search with filters  
- Slot-based appointment booking  
- Visual live queue representation  
- Unique MediQ ID and QR code generation  
- Analytics APIs for visitor tracking  

---

## Local Development Setup(Restricted)
