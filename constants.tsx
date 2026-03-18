
import { ItineraryItem, Padrinos } from './types';

export const WEDDING_DATE = new Date('2026-12-14T17:00:00');

export const ITINERARY: ItineraryItem[] = [
  { time: "5:00 - 5:45 P. M.", activity: "Ceremonia Religiosa" },
  { time: "5:00 - 7:00 P. M.", activity: "Hora de Cócteles" },
  { time: "7:00 - 7:15 P. M.", activity: "Los invitados se sientan para cenar" },
  { time: "7:20 - 7:25 P. M.", activity: "Entrada de la Corte Nupcial" },
  { time: "7:25 - 7:30 P. M.", activity: "Primer baile de los recién casados" },
  { time: "7:30 - 7:50 P. M.", activity: "Brindis de bienvenida (Padre de la novia)" },
  { time: "7:50 - 8:15 P. M.", activity: "Servicio de Entrada" },
  { time: "8:15 - 9:00 P. M.", activity: "Primer plato y brindis familiares" },
  { time: "9:00 - 9:45 P. M.", activity: "Baile de padre e hija" }
];

export const NAMES = {
  groom: "Alejandro Castañeda",
  bride: "Lucía Fernandez"
};

export const PADRINOS: Padrinos = {
  brideParents: ["Sr. Ricardo Fernandez", "Sra. Sofia Morales"],
  groomParents: ["Sr. Roberto Castañeda", "Sra. Elena Ortiz"],
  godparents: ["Sr. Alberto Ruiz", "Sra. Carmen Vega"]
};

export const IMAGES = {
  main: "https://res.cloudinary.com/dcnynnstm/image/upload/v1767900578/06_xyon3q.jpg",
  gallery: [
    "https://res.cloudinary.com/dcnynnstm/image/upload/v1767900578/02_nvhlgx.jpg",
    "https://res.cloudinary.com/dcnynnstm/image/upload/v1767900579/08_pfh9ht.jpg",
    "https://res.cloudinary.com/dcnynnstm/image/upload/v1767900579/09_olq7ud.jpg",
    "https://res.cloudinary.com/dcnynnstm/image/upload/v1767900578/05_tozjlu.jpg",
    "https://res.cloudinary.com/dcnynnstm/image/upload/v1767900578/07_khkp5n.jpg"
  ],
  music: "https://res.cloudinary.com/dcnynnstm/video/upload/v1770267002/Alex_Warren_-_Ordinary_Official_Music_Video_kdtsaz.mp3"
};

export const MAP_URL = "https://maps.app.goo.gl/qsUR3tf6GRittyLeA";

export const WHATSAPP_URL = "https://wa.me/qr/6RFCERSFATCJK1";
export const WHATSAPP_NUMBER = "932350348";
