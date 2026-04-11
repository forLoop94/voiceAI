import React, { useState } from 'react';
import './precallform.css';

export function PreCallForm({ onSubmit }) {
  const [name,   setName]   = useState('');
  const [email,  setEmail]  = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  const clearError = (field) =>
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  const validate = () => {
    const e = {};
    if (!name.trim())  e.name  = 'Please enter your full name.';
    if (!email.trim()) {
      e.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = 'Please enter a valid email address.';
    }
    if (!reason.trim()) e.reason = 'Please briefly describe what you need help with.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({ name: name.trim(), email: email.trim(), reason: reason.trim() });
  };

  return (
    <form className="pre-call-form" onSubmit={handleSubmit} noValidate>
      <p className="pre-call-notice">
        To make your support session as smooth as possible, we collect a few details before
        connecting you. Providing your name and email here means our system has an accurate
        record — so you will not need to spell anything out during the call, and we can
        follow up with you if needed.
      </p>

      <div className="form-field">
        <label htmlFor="pcf-name">Full Name</label>
        <input
          id="pcf-name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); clearError('name'); }}
          placeholder="e.g. Amara Diallo"
          autoComplete="name"
          aria-describedby={errors.name ? 'pcf-name-error' : undefined}
        />
        {errors.name && <span id="pcf-name-error" className="field-error" role="alert">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="pcf-email">Email Address</label>
        <input
          id="pcf-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
          placeholder="e.g. amara@company.com"
          autoComplete="email"
          aria-describedby={errors.email ? 'pcf-email-error' : undefined}
        />
        {errors.email && <span id="pcf-email-error" className="field-error" role="alert">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="pcf-reason">Reason for Call</label>
        <textarea
          id="pcf-reason"
          value={reason}
          onChange={(e) => { setReason(e.target.value); clearError('reason'); }}
          placeholder="Briefly describe what you need help with today"
          rows={3}
          aria-describedby={errors.reason ? 'pcf-reason-error' : undefined}
        />
        {errors.reason && <span id="pcf-reason-error" className="field-error" role="alert">{errors.reason}</span>}
      </div>

      <button type="submit" className="btn-continue">
        Continue to Voice Session
      </button>
    </form>
  );
}
