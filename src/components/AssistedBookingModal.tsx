import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  MessageSquare,
  Volume2,
  CheckCircle2,
  Sparkles,
  Phone,
  Send,
  HelpCircle
} from 'lucide-react';

interface AssistedBookingModalProps {
  onClose: () => void;
  onBookThroughApp: () => void;
}

export const AssistedBookingModal: React.FC<AssistedBookingModalProps> = ({
  onClose,
  onBookThroughApp
}) => {
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected'>('idle');
  const [whatsAppSent, setWhatsAppSent] = useState(false);

  const startVoiceCall = () => {
    setIsCalling(true);
    setCallStatus('ringing');
    setTimeout(() => {
      setCallStatus('connected');
    }, 1800);
  };

  const endVoiceCall = () => {
    setIsCalling(false);
    setCallStatus('idle');
  };

  const handleWhatsAppBooking = () => {
    setWhatsAppSent(true);
    const message = encodeURIComponent(
      'Namaste Navonmesh! I would like to book an assisted scrap pickup for my home. Address: Shanti Vihar, Sector 14. Material: Paper & Metal approx 15kg.'
    );
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#E7DDCE] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#3B1458] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-extrabold text-base text-white">
              Assisted Booking
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-200 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 bg-[#FAF8F5]">
          <div className="text-center space-y-1">
            <h4 className="font-display font-bold text-base text-slate-900">
              Low Smartphone Literacy?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              No problem! You do not need to fill online forms. Speak to our neighborhood voice IVR or WhatsApp coordinator in Hindi or English.
            </p>
          </div>

          {/* Simulated Voice Call Box */}
          {isCalling ? (
            <div className="bg-purple-950 text-white p-5 rounded-2xl text-center space-y-3 shadow-md animate-pulse">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                <Volume2 className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="font-bold text-sm">
                  {callStatus === 'ringing' ? 'Connecting to 1800-KABADI...' : 'Connected with Support Coordinator'}
                </div>
                <div className="text-[11px] text-purple-200 mt-1">
                  {callStatus === 'ringing' ? 'Ringing Delhi-NCR Desk' : '“नमस्ते, कबाड़ीवाला कनेक्ट में आपका स्वागत है। आपका पता बताएं...”'}
                </div>
              </div>
              <button
                onClick={endVoiceCall}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
              >
                End Call
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Option 1: Toll Free Call */}
              <button
                onClick={startVoiceCall}
                className="w-full p-4 rounded-2xl bg-white border border-[#E7DDCE] hover:border-amber-400 text-left flex items-center gap-3.5 transition-all shadow-xs min-h-[58px]"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>Call for Assisted Booking</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 rounded">
                      Toll-Free
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Dial 1800-522-234 (Hindi / English / Hinglish)
                  </div>
                </div>
              </button>

              {/* Option 2: WhatsApp Booking */}
              <button
                onClick={handleWhatsAppBooking}
                className="w-full p-4 rounded-2xl bg-[#E8F8F0] border border-emerald-300 hover:border-emerald-400 text-left flex items-center gap-3.5 transition-all shadow-xs min-h-[58px]"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>WhatsApp Booking</span>
                    <span className="text-[10px] font-semibold text-emerald-900 bg-emerald-200 px-1.5 rounded">
                      1-Tap Chat
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Send photo of scrap or voice note
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Informational Callout */}
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              All assisted bookings are logged into the digital trust layer with the same unique Transaction ID and calibrated scale guarantee.
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookThroughApp();
            }}
            className="w-full text-center text-xs font-bold text-[#3B1458] hover:underline pt-1 block"
          >
            Or Continue with 6-Step App Form →
          </button>
        </div>
      </div>
    </div>
  );
};
