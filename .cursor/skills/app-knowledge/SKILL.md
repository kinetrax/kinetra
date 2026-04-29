---
name: app-knowledge
description: Core knowledge about the KinetraX application — what it does, who it serves, how it works, and how it earns. Use when the user asks to build features, write code, make product decisions, create content, or anything that requires understanding what KinetraX is and how the platform operates.
---

# KinetraX — App Knowledge

## What Is KinetraX

A **marketplace for training and coaching sessions** built as a **Telegram Mini App** on the **TON blockchain**.

Think of it as:
- Uber connects drivers and riders
- Airbnb connects hosts and guests
- **KinetraX connects coaches/trainers with people who want training**

## Two-Sided Marketplace

### Supply side — Coaches / Trainers

People who teach physical training activities: fitness, gym, yoga, sports, martial arts, running, swimming, etc.

They create sessions on the platform, for example:
- "Morning fitness class — 5 TON"
- "Private football training — 10 TON"

**Why they use KinetraX:**
- Get discovered by nearby users (exposure)
- Attract more clients without manual outreach
- Verified badge builds trust
- Platform promotes them to relevant audiences

### Demand side — Users / Clients / Learners

People who want to train, improve fitness, or get coached.

**Why they use KinetraX:**
- Easy to find trainers nearby (map-based discovery)
- Compare options, read reviews
- Book and pay instantly
- Trust verified coaches

## Core User Flow

```
Coach creates session → User discovers it → User books & pays → Platform takes fee → Coach receives earnings
```

### Detailed flow

1. **Coach** creates a session (name, type, description, location, date/time, duration, price in TON, available slots, wallet address)
2. **User** browses sessions on an interactive map, filters by type/location
3. **User** books a session and pays via TON Connect wallet
4. **Smart contract** splits the payment: coach gets the bulk, platform takes a small commission
5. **User** receives a unique verification code (SHA-256 hash)
6. **Coach** verifies the participant code at the session
7. Both parties can view session history and stats

## Business Model

### Commission structure

| Payment method | Platform fee | Coach receives |
|----------------|-------------|----------------|
| TON (Toncoin)  | 1–3%        | 97–99%         |
| KNT token      | 0%          | 100%           |

Default commission: **2%** (200 basis points), configurable by platform owner via smart contract.

This incentivizes KNT token usage — zero fees for coaches who accept KNT payments.

### Revenue sources

- Commission on every session booking paid in TON
- Future: premium features, promoted listings, verified badge fees

## Token — KNT

- **Name**: KinetraX Token
- **Ticker**: KNT
- **Total supply**: 21,000,000
- **Blockchain**: TON (Jetton standard)

### Token distribution

| Allocation              | %   |
|------------------------|-----|
| Team                   | 25% |
| Ecosystem Development  | 25% |
| Presale                | 10% |
| Community Rewards      | 10% |
| Growth Campaigns       | 5%  |
| Liquidity Pool         | 10% |
| Reserve Fund           | 10% |
| Marketing & Promotions | 5%  |

### Token utility

- Pay for sessions with 0% platform fee
- Payment discounts when using KNT
- Priority access to selected feature rollouts and campaigns
- Community incentives

## Tech Stack

### Telegram Mini App (the product)

| Layer          | Technology                                      |
|----------------|------------------------------------------------|
| Frontend       | React 18, TypeScript, Tailwind CSS, Telegram Mini Apps SDK, MapTiler |
| Backend        | Fastify, TypeScript, TypeORM, PostgreSQL, Redis |
| Blockchain     | TON, Tolk smart contracts, TON Connect          |
| Authentication | Telegram Web App (no passwords)                 |

### Marketing website (this repo)

| Component  | Technology                           |
|------------|--------------------------------------|
| Pages      | Static HTML (`index.html`, `whitepaper.html`, `terms-of-use.html`, `privacy-policy.html`) |
| Styles     | Single CSS file (`css/styles.css`)   |
| Scripts    | Vanilla JS (`js/script.js`, `js/translations.js`) |
| i18n       | `data-i18n` attributes, EN/RU       |
| Domain     | kinetra-x.com                        |

## Smart Contract

Session Payment Contract on TON, written in Tolk:

- Receives payments from participants
- Automatically splits between coach wallet and platform wallet
- Commission rate configurable (default 2%)

## Key Platform Features

- **Map-based session discovery** with real-time availability
- **TON Connect wallet** integration for payments
- **Participant verification codes** (SHA-256 hash-based)
- **Session management** (create, update, delete, view participants)
- **User profiles** linked to Telegram accounts
- **Session history** (past and upcoming, as trainer or participant)
- **Bilingual** marketing site (EN/RU)

## Terminology

| Term | Meaning |
|------|---------|
| Coach / Trainer | Supply side — creates and leads sessions |
| User / Client / Athlete / Learner | Demand side — books and attends sessions |
| Session | A training event with time, place, price, and slots |
| Booking | A user reserving and paying for a session slot |
| Verification code | Unique code proving a user booked a session |
| KNT | The platform's native token on TON |
