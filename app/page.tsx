'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import Link from 'next/link';
import { ExternalLink, QrCode as QrIcon, ShieldCheck, Copy, Check, School } from 'lucide-react';

const SAMPLE_TOKENS = [
  {
    title: 'Valid Student — Dues Pending (৳1000)',
    name: 'MD ARAFAT ZAYED LAM',
    token: '98f3334d22dbdf6052f04868180f94cf3d7a641351fbcab3817142d7a48867f9',
    badge: 'bg-emerald-100 text-emerald-800',
    status: 'Authentic',
  },
  {
    title: 'Valid Student — All Dues Cleared (৳0)',
    name: 'MD AROB JUBER ALIF',
    token: 'b4c2e6d198f3334d22dbdf6052f04868180f94cf3d7a641351fbcab3817142a1',
    badge: 'bg-blue-100 text-blue-800',
    status: 'Authentic',
  },
  {
    title: 'Revoked / Suspended Admit Card',
    name: 'MD MILON MOHON',
    token: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    badge: 'bg-amber-100 text-amber-800',
    status: 'Suspended',
  },
  {
    title: 'Unregistered / Invalid Token',
    name: 'MD IMRAN TALUKDAR',
    token: '0000000000000000000000000000000000000000000000000000000000000000',
    badge: 'bg-rose-100 text-rose-800',
    status: 'Invalid',
  },
];

export default function HomePage() {
  const [selectedToken, setSelectedToken] = useState(SAMPLE_TOKENS[0].token);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const verifyUrl = `${origin || 'http://localhost:3000'}/verify?t=${selectedToken}`;

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).then(setQrDataUrl);
  }, [verifyUrl]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" /> Live Verification Demo
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Admit Card QR Verification System
          </h1>
          <p className="text-slate-600 text-sm max-w-lg mx-auto">
            Scan the QR code with your mobile camera or click below to simulate server-side authentication against Supabase.
          </p>
        </div>

        {/* Dashboard Box */}
        <div className="grid md:grid-cols-12 gap-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          
          {/* Left: Test Cases */}
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select a Test Student Record
            </h2>
            
            <div className="space-y-2.5">
              {SAMPLE_TOKENS.map((item) => (
                <button
                  key={item.token}
                  onClick={() => setSelectedToken(item.token)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    selectedToken === item.token
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.name}</div>
                    <div className="font-mono text-[11px] text-slate-400 truncate max-w-xs">
                      {item.token}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.badge}`}>
                    {item.status}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Generated URL
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={verifyUrl}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono w-full text-slate-700 select-all"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Live QR */}
          <div className="md:col-span-5 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-6 text-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <QrIcon className="w-4 h-4 text-indigo-600" /> Live QR Code
            </h2>

            {qrDataUrl && (
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <img src={qrDataUrl} alt="Verification QR Code" className="w-48 h-48 rounded" />
              </div>
            )}

            <p className="text-xs text-slate-500 mt-3 max-w-xs">
              Point your phone camera to scan the code in real-time.
            </p>

            <Link
              href={`/verify?t=${selectedToken}`}
              className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition"
            >
              Open Verification Page <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}
