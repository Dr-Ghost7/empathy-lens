'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plane, CheckCircle2, X } from 'lucide-react';

interface ScenarioProps {
  appliedFixes: Record<string, boolean>;
  onSuccess?: () => void;
}

interface Seat {
  id: string;
  row: number;
  col: string;
  status: 'available' | 'occupied' | 'selected';
  price: number;
}

const INITIAL_SEATS: Seat[] = [
  { id: '12A', row: 12, col: 'A', status: 'occupied', price: 150 },
  { id: '12B', row: 12, col: 'B', status: 'occupied', price: 140 },
  { id: '12C', row: 12, col: 'C', status: 'available', price: 140 },
  { id: '12D', row: 12, col: 'D', status: 'available', price: 140 },
  { id: '12E', row: 12, col: 'E', status: 'occupied', price: 140 },
  { id: '12F', row: 12, col: 'F', status: 'available', price: 150 },

  { id: '13A', row: 13, col: 'A', status: 'available', price: 150 },
  { id: '13B', row: 13, col: 'B', status: 'occupied', price: 140 },
  { id: '13C', row: 13, col: 'C', status: 'occupied', price: 140 },
  { id: '13D', row: 13, col: 'D', status: 'available', price: 140 },
  { id: '13E', row: 13, col: 'E', status: 'available', price: 140 },
  { id: '13F', row: 13, col: 'F', status: 'occupied', price: 150 },

  { id: '14A', row: 14, col: 'A', status: 'occupied', price: 150 },
  { id: '14B', row: 14, col: 'B', status: 'available', price: 140 }, // TARGET SEAT
  { id: '14C', row: 14, col: 'C', status: 'occupied', price: 140 },
  { id: '14D', row: 14, col: 'D', status: 'available', price: 140 },
  { id: '14E', row: 14, col: 'E', status: 'occupied', price: 140 },
  { id: '14F', row: 14, col: 'F', status: 'available', price: 150 },
];

export function KeyboardSeatPickerScenario({ appliedFixes, onSuccess }: ScenarioProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const hasSemanticButtons = appliedFixes['semantic_buttons'] ?? false;
  const hasVisibleFocus = appliedFixes['visible_focus'] ?? false;
  const hasModalFocusTrap = appliedFixes['modal_focus_trap'] ?? false;

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    setSelectedSeat(seat.id);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    setBookingConfirmed(true);
    if (selectedSeat === '14B') {
      onSuccess?.();
    }
  };

  // Focus trap inside modal when active
  useEffect(() => {
    if (!modalOpen || !hasModalFocusTrap) return;

    confirmBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, hasModalFocusTrap]);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden font-sans relative">
      {/* Flight Banner */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Plane className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-bold text-sm text-white">Flight AF-492: Paris → Tokyo</h3>
            <p className="text-[11px] text-slate-400">Select Seat 14B to proceed</p>
          </div>
        </div>
        <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
          Economy
        </span>
      </div>

      <div className="p-6">
        {bookingConfirmed ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Seat {selectedSeat} Confirmed!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Boarding pass generated. You successfully navigated and booked using keyboard access.
            </p>
            <button
              onClick={() => {
                setBookingConfirmed(false);
                setSelectedSeat(null);
              }}
              className="text-xs text-emerald-400 font-semibold hover:underline mt-2"
            >
              Reset Booking Demo
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-700 border border-slate-600 inline-block" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-800/50 border border-slate-800 inline-block opacity-40" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-400 inline-block" />
                <span>Selected</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="space-y-2.5 max-w-sm mx-auto">
              {[12, 13, 14].map((rowNum) => {
                const rowSeats = INITIAL_SEATS.filter((s) => s.row === rowNum);
                const leftAisle = rowSeats.slice(0, 3);
                const rightAisle = rowSeats.slice(3, 6);

                return (
                  <div key={rowNum} className="flex items-center justify-between gap-3">
                    <span className="w-6 text-[11px] font-mono font-bold text-slate-500 text-center">
                      R{rowNum}
                    </span>

                    {/* Left seats A, B, C */}
                    <div className="flex gap-2">
                      {leftAisle.map((seat) => {
                        const isSelected = selectedSeat === seat.id;
                        const isOccupied = seat.status === 'occupied';

                        const seatClasses = `w-9 h-9 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                          isOccupied
                            ? 'bg-slate-800/40 text-slate-600 border border-slate-800 cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-500 text-slate-950 border border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500'
                        } ${
                          hasVisibleFocus
                            ? 'focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none'
                            : 'outline-none ring-0'
                        }`;

                        /* Flawed (div with no tabIndex) vs Fixed (button with tabIndex=0) */
                        if (hasSemanticButtons) {
                          return (
                            <button
                              key={seat.id}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => handleSeatClick(seat)}
                              aria-label={`Seat ${seat.id}, ${isOccupied ? 'Occupied' : `$${seat.price}`}`}
                              aria-pressed={isSelected}
                              className={`${seatClasses} cursor-pointer`}
                            >
                              {seat.col}
                            </button>
                          );
                        }

                        return (
                          <div
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            className={seatClasses}
                          >
                            {seat.col}
                          </div>
                        );
                      })}
                    </div>

                    {/* Aisle */}
                    <div className="w-4 border-l border-r border-dashed border-slate-800 h-9" />

                    {/* Right seats D, E, F */}
                    <div className="flex gap-2">
                      {rightAisle.map((seat) => {
                        const isSelected = selectedSeat === seat.id;
                        const isOccupied = seat.status === 'occupied';

                        const seatClasses = `w-9 h-9 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                          isOccupied
                            ? 'bg-slate-800/40 text-slate-600 border border-slate-800 cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-500 text-slate-950 border border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500'
                        } ${
                          hasVisibleFocus
                            ? 'focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none'
                            : 'outline-none ring-0'
                        }`;

                        if (hasSemanticButtons) {
                          return (
                            <button
                              key={seat.id}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => handleSeatClick(seat)}
                              aria-label={`Seat ${seat.id}, ${isOccupied ? 'Occupied' : `$${seat.price}`}`}
                              aria-pressed={isSelected}
                              className={`${seatClasses} cursor-pointer`}
                            >
                              {seat.col}
                            </button>
                          );
                        }

                        return (
                          <div
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            className={seatClasses}
                          >
                            {seat.col}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400">Selected:</span>
                <p className="text-xs font-bold text-white">
                  {selectedSeat ? `Seat ${selectedSeat} ($140)` : 'None'}
                </p>
              </div>

              <button
                type="button"
                disabled={!selectedSeat}
                onClick={() => setModalOpen(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSeat
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md cursor-pointer'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                } ${
                  hasVisibleFocus
                    ? 'focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none'
                    : 'outline-none ring-0'
                }`}
              >
                Continue to Confirm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal={hasModalFocusTrap ? 'true' : undefined}
          aria-labelledby="dialog-title"
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            ref={modalRef}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-xs w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 id="dialog-title" className="text-sm font-bold text-white">
                Confirm Reservation
              </h4>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close dialog"
                className={`text-slate-400 hover:text-white p-1 rounded ${
                  hasVisibleFocus
                    ? 'focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none'
                    : 'outline-none ring-0'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Confirm selection of <strong>Seat {selectedSeat}</strong> for Flight AF-492 to Tokyo
              Haneda ($140.00).
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer ${
                  hasVisibleFocus
                    ? 'focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none'
                    : 'outline-none ring-0'
                }`}
              >
                Back
              </button>
              <button
                ref={confirmBtnRef}
                type="button"
                onClick={handleConfirm}
                className={`flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-md ${
                  hasVisibleFocus
                    ? 'focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none'
                    : 'outline-none ring-0'
                }`}
              >
                Book Seat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
