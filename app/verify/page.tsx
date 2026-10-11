import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  GraduationCap, 
  CalendarCheck,
  ChevronLeft 
} from 'lucide-react';

interface VerifyPageProps {
  searchParams: {
    t?: string;
  };
}

export const revalidate = 0; // Dynamic server lookup

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const token = searchParams.t?.trim();
  const isHexToken = Boolean(token && /^[a-fA-F0-9]{64}$/.test(token));

  let record: any = null;
  let status: 'valid' | 'invalid' | 'revoked' = 'invalid';

  if (isHexToken) {
    const { data, error } = await supabaseServer
      .from('admit_cards')
      .select('*')
      .eq('verification_token', token)
      .maybeSingle();

    if (data && !error) {
      if (data.is_valid) {
        status = 'valid';
        record = data;
      } else {
        status = 'revoked';
        record = data;
      }
    }
  }

  // Format verified timestamp
  const verifiedAt = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6">
      <div className="max-w-xl w-full mx-auto">
        
        {/* Header (Inspired by reference, neutral university branding) */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-white mb-2 shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            University Admission & Examination Portal
          </h1>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mt-0.5">
            Admit Card Authentication
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Status Banners */}
          {status === 'valid' && (
            <div className="p-6 bg-emerald-50/80 border-b border-emerald-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-emerald-900">Genuine Admit Card</h2>
              <p className="text-xs text-emerald-700 mt-1">
                This admit card is authentic and was officially issued by the University.
              </p>
            </div>
          )}

          {status === 'revoked' && (
            <div className="p-6 bg-amber-50/80 border-b border-amber-200 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-2">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-amber-900">Revoked / Suspended Admit Card</h2>
              <p className="text-xs text-amber-700 mt-1">
                This document was found in records but has been placed on hold or revoked by the authority.
              </p>
            </div>
          )}

          {status === 'invalid' && (
            <div className="p-6 bg-rose-50/80 border-b border-rose-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 mb-2">
                <XCircle className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-rose-900">Unverified or Invalid Document</h2>
              <p className="text-xs text-rose-700 mt-1">
                No matching admit card was found for this token.
              </p>
            </div>
          )}

          {/* Table Data */}
          {record ? (
            <div className="divide-y divide-slate-100 text-sm">
              <div className="grid grid-cols-3 px-6 py-3.5 bg-white">
                <span className="text-slate-500 font-medium col-span-1">Student Name</span>
                <span className="font-semibold text-slate-900 col-span-2">{record.student_name}</span>
              </div>
              <div className="grid grid-cols-3 px-6 py-3.5 bg-slate-50/50">
                <span className="text-slate-500 font-medium col-span-1">Student ID</span>
                <span className="font-mono text-slate-800 col-span-2 font-medium">{record.student_id}</span>
              </div>
              <div className="grid grid-cols-3 px-6 py-3.5 bg-white">
                <span className="text-slate-500 font-medium col-span-1">Department</span>
                <span className="text-slate-800 col-span-2">{record.department}</span>
              </div>
              <div className="grid grid-cols-3 px-6 py-3.5 bg-slate-50/50">
                <span className="text-slate-500 font-medium col-span-1">Program</span>
                <span className="text-slate-800 col-span-2">{record.program}</span>
              </div>
              <div className="grid grid-cols-3 px-6 py-3.5 bg-white">
                <span className="text-slate-500 font-medium col-span-1">Exam</span>
                <span className="text-slate-800 col-span-2 font-medium">{record.exam_title}</span>
              </div>
              <div className="grid grid-cols-3 px-6 py-3.5 bg-slate-50/50">
                <span className="text-slate-500 font-medium col-span-1">Semester</span>
                <span className="text-slate-800 col-span-2">{record.semester}</span>
              </div>
              <div className="grid grid-cols-3 px-6 py-3.5 bg-white">
                <span className="text-slate-500 font-medium col-span-1">Current Dues</span>
                <span className="col-span-2">
                  {Number(record.dues_amount) > 0 ? (
                    <span className="font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded text-xs">
                      ৳{Number(record.dues_amount).toFixed(2)}
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded text-xs">
                      ৳0.00 (Cleared)
                    </span>
                  )}
                </span>
              </div>
              <div className="grid grid-cols-3 px-6 py-3.5 bg-slate-50/50">
                <span className="text-slate-500 font-medium col-span-1">Verified at</span>
                <span className="text-slate-600 col-span-2 text-xs flex items-center gap-1.5 font-mono">
                  <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
                  {verifiedAt}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">
              <p>Please re-scan the QR code printed on the physical admit card.</p>
            </div>
          )}

          {/* Footer note */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified by Digital Examination & Records System
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
            Return to Generator
          </Link>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-400 mt-8">
        &copy; {new Date().getFullYear()} Digital Examination System &mdash; Demonstration Portal
      </footer>
    </main>
  );
}