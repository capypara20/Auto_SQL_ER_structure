-- PostgreSQL Large-Scale Banking System
-- 15+ tables with complex financial relationships

CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    ssn VARCHAR(11) UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) NOT NULL DEFAULT 'USA',
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS branches (
    branch_id SERIAL PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL,
    branch_code VARCHAR(20) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    manager_name VARCHAR(100),
    opening_date DATE
);

CREATE TABLE IF NOT EXISTS account_types (
    account_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    minimum_balance NUMERIC(12, 2) DEFAULT 0,
    interest_rate NUMERIC(5, 4) DEFAULT 0,
    monthly_fee NUMERIC(8, 2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS accounts (
    account_id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    account_type_id INTEGER NOT NULL,
    branch_id INTEGER NOT NULL,
    balance NUMERIC(15, 2) DEFAULT 0 CHECK (balance >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed')),
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (account_type_id) REFERENCES account_types(account_type_id),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id BIGSERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer', 'payment', 'fee')),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    balance_after NUMERIC(15, 2) NOT NULL,
    description TEXT,
    reference_number VARCHAR(50) UNIQUE,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
    transaction_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE IF NOT EXISTS transfers (
    transfer_id BIGSERIAL PRIMARY KEY,
    from_account_id INTEGER NOT NULL,
    to_account_id INTEGER NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    transfer_type VARCHAR(20) DEFAULT 'internal' CHECK (transfer_type IN ('internal', 'domestic', 'international')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    fee NUMERIC(10, 2) DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (from_account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (to_account_id) REFERENCES accounts(account_id),
    CHECK (from_account_id != to_account_id)
);

CREATE TABLE IF NOT EXISTS loans (
    loan_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    loan_type VARCHAR(50) NOT NULL CHECK (loan_type IN ('personal', 'mortgage', 'auto', 'business', 'student')),
    principal_amount NUMERIC(15, 2) NOT NULL CHECK (principal_amount > 0),
    interest_rate NUMERIC(5, 4) NOT NULL,
    term_months INTEGER NOT NULL CHECK (term_months > 0),
    monthly_payment NUMERIC(12, 2) NOT NULL,
    outstanding_balance NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'paid_off', 'defaulted')),
    approved_at TIMESTAMP WITH TIME ZONE,
    disbursed_at TIMESTAMP WITH TIME ZONE,
    maturity_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS loan_payments (
    payment_id BIGSERIAL PRIMARY KEY,
    loan_id INTEGER NOT NULL,
    payment_amount NUMERIC(12, 2) NOT NULL CHECK (payment_amount > 0),
    principal_paid NUMERIC(12, 2) NOT NULL,
    interest_paid NUMERIC(12, 2) NOT NULL,
    payment_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'paid' CHECK (status IN ('paid', 'late', 'missed')),
    FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
);

CREATE TABLE IF NOT EXISTS credit_cards (
    card_id SERIAL PRIMARY KEY,
    card_number VARCHAR(16) NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    card_type VARCHAR(20) DEFAULT 'standard' CHECK (card_type IN ('standard', 'gold', 'platinum', 'business')),
    credit_limit NUMERIC(12, 2) NOT NULL CHECK (credit_limit > 0),
    available_credit NUMERIC(12, 2) NOT NULL,
    current_balance NUMERIC(12, 2) DEFAULT 0,
    interest_rate NUMERIC(5, 4) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    cvv VARCHAR(3) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'expired', 'cancelled')),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS card_transactions (
    transaction_id BIGSERIAL PRIMARY KEY,
    card_id INTEGER NOT NULL,
    merchant_name VARCHAR(200),
    merchant_category VARCHAR(50),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_type VARCHAR(20) DEFAULT 'purchase' CHECK (transaction_type IN ('purchase', 'cash_advance', 'refund', 'fee')),
    transaction_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(200),
    status VARCHAR(20) DEFAULT 'posted' CHECK (status IN ('pending', 'posted', 'declined', 'reversed')),
    FOREIGN KEY (card_id) REFERENCES credit_cards(card_id)
);

CREATE TABLE IF NOT EXISTS beneficiaries (
    beneficiary_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    beneficiary_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    bank_name VARCHAR(100),
    routing_number VARCHAR(20),
    relationship VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS standing_orders (
    standing_order_id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    beneficiary_id INTEGER NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    next_execution_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'completed')),
    description TEXT,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(beneficiary_id)
);

CREATE TABLE IF NOT EXISTS investments (
    investment_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    investment_type VARCHAR(50) NOT NULL CHECK (investment_type IN ('stocks', 'bonds', 'mutual_funds', 'etf', 'cd', 'savings_bond')),
    symbol VARCHAR(20),
    quantity NUMERIC(15, 4),
    purchase_price NUMERIC(12, 2),
    current_price NUMERIC(12, 2),
    purchase_date DATE NOT NULL,
    maturity_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'matured')),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS atm_transactions (
    atm_transaction_id BIGSERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    atm_id VARCHAR(20) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('withdrawal', 'deposit', 'balance_inquiry', 'transfer')),
    amount NUMERIC(12, 2),
    fee NUMERIC(8, 2) DEFAULT 0,
    transaction_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(200),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'cancelled')),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE IF NOT EXISTS fraud_alerts (
    alert_id BIGSERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    account_id INTEGER,
    card_id INTEGER,
    alert_type VARCHAR(50) NOT NULL,
    risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
    resolved_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (card_id) REFERENCES credit_cards(card_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    customer_id INTEGER,
    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
