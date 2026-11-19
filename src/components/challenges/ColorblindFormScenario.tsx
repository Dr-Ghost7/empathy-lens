'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, UserCheck, Shield } from 'lucide-react';

interface ScenarioProps {
  appliedFixes: Record<string, boolean>;
  onSuccess?: () => void;
}

export function ColorblindFormScenario({ appliedFixes, onSuccess }: ScenarioProps) {
  const [name, setName] = useState('Dr. Alex Morgan');
  const [email, setEmail] = useState('alex.morgan.healthcorp.com'); // missing @
  const [license, setLicense] = useState('MED-429'); // incomplete, needs 6 digits
  const [dept, setDept] = useState('Neurology');
  const [submitted, setSubmitted] = useState(false);

  const hasStatusIcons = appliedFixes['status_icons'] ?? false;
  const hasErrorText = appliedFixes['error_text'] ?? false;
  const hasAriaValidation = appliedFixes['aria_validation'] ?? false;

  const isEmailValid = email.includes('@') && email.includes('.');
  const isLicenseValid = /^MED-\d{6}$/.test(license);
  const isFormValid = isEmailValid && isLicenseValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert('Form has validation errors! Please correct them before submitting.');
      return;
    }
    setSubmitted(true);
    onSuccess?.();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden font-sans">
      {/* Clinic Header */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-bold text-sm text-white">Clinical Portal Registration</h3>
            <p className="text-[11px] text-slate-400">Step 2: Provider Credentialing</p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
          ID: #PRV-81
        </span>
      </div>

      <div className="p-6">
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Credentials Verified!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your medical provider registration has passed validation.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail('alex.morgan.healthcorp.com');
                setLicense('MED-429');
              }}
              className="text-xs text-emerald-400 font-semibold hover:underline mt-2 cursor-pointer"
            >
              Reset Form Demo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Valid) */}
            <div>
              <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-300 mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-800 border-2 border-emerald-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                {hasStatusIcons && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3 pointer-events-none" />
                )}
              </div>
            </div>

            {/* Email Field (Invalid by default) */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 mb-1">
                Hospital Network Email
              </label>
              <div className="relative">
                <input
                  id="reg-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={hasAriaValidation ? !isEmailValid : undefined}
                  aria-describedby={hasAriaValidation ? 'email-err' : undefined}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-800 border-2 text-white transition-colors focus:outline-none ${
                    isEmailValid ? 'border-emerald-500' : 'border-rose-500'
                  }`}
                />
                {hasStatusIcons && (
                  <div className="absolute right-3 top-3 pointer-events-none">
                    {isEmailValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                )}
              </div>
              {hasErrorText && !isEmailValid && (
                <p id="email-err" className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  Must contain a valid domain (e.g. name@hospital.org)
                </p>
              )}
            </div>

            {/* License Number (Invalid by default) */}
            <div>
              <label htmlFor="reg-license" className="block text-xs font-semibold text-slate-300 mb-1">
                Medical License Identifier
              </label>
              <div className="relative">
                <input
                  id="reg-license"
                  type="text"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="MED-123456"
                  aria-invalid={hasAriaValidation ? !isLicenseValid : undefined}
                  aria-describedby={hasAriaValidation ? 'license-err' : undefined}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-800 border-2 text-white transition-colors focus:outline-none ${
                    isLicenseValid ? 'border-emerald-500' : 'border-rose-500'
                  }`}
                />
                {hasStatusIcons && (
                  <div className="absolute right-3 top-3 pointer-events-none">
                    {isLicenseValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                )}
              </div>
              {hasErrorText && !isLicenseValid && (
                <p id="license-err" className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  Format must be MED- followed by 6 digits (e.g. MED-429810)
                </p>
              )}
            </div>

            {/* Department (Valid) */}
            <div>
              <label htmlFor="reg-dept" className="block text-xs font-semibold text-slate-300 mb-1">
                Clinical Specialty
              </label>
              <div className="relative">
                <input
                  id="reg-dept"
                  type="text"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-slate-800 border-2 border-emerald-500 text-white focus:outline-none"
                />
                {hasStatusIcons && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3 pointer-events-none" />
                )}
              </div>
            </div>

            {/* Hint Box */}
            <div className="text-[11px] bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-slate-400">
              💡 <strong>Exercise:</strong> Fix the email to include an <code>@</code> and change the license to <code>MED-429810</code>, then hit Submit.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md cursor-pointer"
            >
              Verify & Register Credentials
            </button>
          </form>
        )}
      </div>

      <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          HIPAA Compliant Form
        </span>
        <span>WCAG 1.4.1 Test Bed</span>
      </div>
    </div>
  );
}
