import { useState, useEffect, FormEvent } from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  FileText, 
  Calendar, 
  Plus, 
  Trash2, 
  ChevronRight,
  Search,
  Menu,
  X,
  Clock,
  MapPin,
  FileUp,
  Download,
  Check,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface SuratMasuk {
  id: number;
  no_agenda: string;
  no_surat: string;
  tgl_surat: string;
  tgl_diterima: string;
  asal_surat: string;
  perihal: string;
  keterangan: string;
  file_path?: string;
}

interface Disposisi {
  id: number;
  surat_id: number;
  no_surat?: string;
  perihal?: string;
  tujuan: string;
  isi: string;
  sifat: string;
  batas_waktu: string;
  catatan: string;
}

interface Agenda {
  id: number;
  nama_kegiatan: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  keterangan: string;
}

interface Stats {
  suratCount: number;
  disposisiCount: number;
  agendaCount: number;
}

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'surat-masuk', label: 'Surat Masuk', icon: Mail },
    { id: 'disposisi', label: 'Disposisi', icon: FileText },
    { id: 'agenda', label: 'Agenda Kegiatan', icon: Calendar },
    { id: 'pencarian', label: 'Pencarian Surat', icon: Search },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800">
      <div className="p-6 border-bottom border-slate-800">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Mail className="text-emerald-400" />
          <span>E-SURAT</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Sistem Arsip Digital</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold">
            AD
          </div>
          <div>
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ stats }: { stats: Stats }) => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-slate-500">Selamat datang di sistem manajemen surat masuk.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Surat Masuk', value: stats.suratCount, icon: Mail, color: 'bg-blue-500' },
          { label: 'Total Disposisi', value: stats.disposisiCount, icon: FileText, color: 'bg-emerald-500' },
          { label: 'Agenda Mendatang', value: stats.agendaCount, icon: Calendar, color: 'bg-amber-500' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6"
          >
            <div className={`${stat.color} p-4 rounded-xl text-white shadow-lg`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Aktivitas Terbaru</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-sm font-semibold">Surat Masuk Baru dari Dinas Pendidikan</p>
                  <p className="text-xs text-slate-500">2 jam yang lalu • No: 421/123/2024</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Agenda Hari Ini</h3>
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm font-bold text-emerald-600">10:00 - 12:00</p>
              <p className="font-semibold mt-1">Rapat Koordinasi Bulanan</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin size={12} /> Ruang Rapat Utama
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuratMasukView = () => {
  const [surat, setSurat] = useState<SuratMasuk[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    no_agenda: '',
    no_surat: '',
    tgl_surat: '',
    tgl_diterima: '',
    asal_surat: '',
    perihal: '',
    keterangan: ''
  });

  const fetchSurat = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/surat-masuk');
      const data = await res.json();
      setSurat(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurat();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value as string);
      });
      if (file) {
        data.append('file', file);
      }

      const url = editingId ? `/api/surat-masuk/${editingId}` : '/api/surat-masuk';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: data
      });
      
      if (res.ok) {
        setShowModal(false);
        setEditingId(null);
        fetchSurat();
        setFile(null);
        setFormData({
          no_agenda: '',
          no_surat: '',
          tgl_surat: '',
          tgl_diterima: '',
          asal_surat: '',
          perihal: '',
          keterangan: ''
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Gagal menyimpan data surat: ${errorData.error || 'Terjadi kesalahan pada server.'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (s: SuratMasuk) => {
    setEditingId(s.id);
    setFormData({
      no_agenda: s.no_agenda,
      no_surat: s.no_surat,
      tgl_surat: s.tgl_surat,
      tgl_diterima: s.tgl_diterima,
      asal_surat: s.asal_surat,
      perihal: s.perihal,
      keterangan: s.keterangan
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus surat ini? Seluruh disposisi terkait juga akan dihapus.')) {
      try {
        const res = await fetch(`/api/surat-masuk/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchSurat();
        } else {
          alert('Gagal menghapus surat.');
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan saat menghapus surat.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Surat Masuk</h2>
          <p className="text-slate-500">Kelola seluruh arsip surat masuk.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus size={20} />
          Tambah Surat
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No. Agenda</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No. Surat</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Asal Surat</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perihal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dokumen</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {surat.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm">{s.no_agenda}</td>
                  <td className="px-6 py-4 text-sm font-medium">{s.no_surat}</td>
                  <td className="px-6 py-4 text-sm">{s.asal_surat}</td>
                  <td className="px-6 py-4 text-sm">{s.perihal}</td>
                  <td className="px-6 py-4 text-sm">
                    {s.file_path ? (
                      <a 
                        href={s.file_path} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        <Download size={14} /> Lihat Dok
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Tidak ada</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(s)}
                        className="text-slate-400 hover:text-emerald-500 transition-colors p-2"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {surat.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Belum ada data surat masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold">{editingId ? 'Edit Surat Masuk' : 'Tambah Surat Masuk'}</h3>
                <button onClick={() => { setShowModal(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">No. Agenda</label>
                    <input 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={formData.no_agenda}
                      onChange={(e) => setFormData({...formData, no_agenda: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">No. Surat</label>
                    <input 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={formData.no_surat}
                      onChange={(e) => setFormData({...formData, no_surat: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Tgl Surat</label>
                    <input 
                      type="date"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={formData.tgl_surat}
                      onChange={(e) => setFormData({...formData, tgl_surat: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Tgl Diterima</label>
                    <input 
                      type="date"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={formData.tgl_diterima}
                      onChange={(e) => setFormData({...formData, tgl_diterima: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Asal Surat</label>
                  <input 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={formData.asal_surat}
                    onChange={(e) => setFormData({...formData, asal_surat: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Perihal</label>
                  <input 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={formData.perihal}
                    onChange={(e) => setFormData({...formData, perihal: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Keterangan</label>
                  <textarea 
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Upload Dokumen</label>
                  <div className="relative group">
                    <input 
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <label 
                      htmlFor="file-upload"
                      className="flex items-center justify-center gap-2 w-full px-4 py-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-all"
                    >
                      {file ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                          <Check size={20} /> {file.name}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400 group-hover:text-emerald-500">
                          <FileUp size={32} className="mb-2" />
                          <span className="text-sm">Klik untuk upload dokumen (PDF/Gambar)</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className={`bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {saving && <Clock className="animate-spin" size={18} />}
                    {saving ? 'Menyimpan...' : 'Simpan Surat'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DisposisiView = () => {
  const [disposisi, setDisposisi] = useState<Disposisi[]>([]);
  const [surat, setSurat] = useState<SuratMasuk[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedTujuan, setSelectedTujuan] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    surat_id: '',
    isi: '',
    sifat: 'Biasa',
    batas_waktu: '',
    catatan: ''
  });

  const daftarTujuan = [
    'Kepala Dinas',
    'Sekretaris',
    'Kabid Kurikulum',
    'Kabid Ketenagaan',
    'Kabid Sarpras',
    'Kasubag Umum',
    'Kasubag Keuangan',
    'Pengawas Sekolah'
  ];

  const fetchData = async () => {
    const [resDisp, resSurat] = await Promise.all([
      fetch('/api/disposisi'),
      fetch('/api/surat-masuk')
    ]);
    setDisposisi(await resDisp.json());
    setSurat(await resSurat.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleTujuan = (t: string) => {
    if (selectedTujuan.includes(t)) {
      setSelectedTujuan(selectedTujuan.filter(item => item !== t));
    } else {
      setSelectedTujuan([...selectedTujuan, t]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedTujuan.length === 0) {
      alert('Pilih minimal satu tujuan disposisi');
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/disposisi/${editingId}` : '/api/disposisi';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tujuan: selectedTujuan.join(', ')
        })
      });

      if (res.ok) {
        setShowModal(false);
        setEditingId(null);
        fetchData();
        setSelectedTujuan([]);
        setFormData({
          surat_id: '',
          isi: '',
          sifat: 'Biasa',
          batas_waktu: '',
          catatan: ''
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Gagal menyimpan disposisi: ${errorData.error || 'Terjadi kesalahan pada server.'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan disposisi.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (d: Disposisi) => {
    setEditingId(d.id);
    setFormData({
      surat_id: d.surat_id.toString(),
      isi: d.isi,
      sifat: d.sifat,
      batas_waktu: d.batas_waktu,
      catatan: d.catatan
    });
    setSelectedTujuan(d.tujuan.split(', '));
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus disposisi ini?')) {
      try {
        const res = await fetch(`/api/disposisi/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchData();
        } else {
          alert('Gagal menghapus disposisi.');
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan saat menghapus disposisi.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Disposisi Surat</h2>
          <p className="text-slate-500">Kelola instruksi tindak lanjut surat.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus size={20} />
          Tambah Disposisi
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No. Surat</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tujuan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sifat</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Batas Waktu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Instruksi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {disposisi.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{d.no_surat}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[200px]">{d.perihal}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{d.tujuan}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      d.sifat === 'Penting' ? 'bg-red-100 text-red-600' : 
                      d.sifat === 'Segera' ? 'bg-amber-100 text-amber-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {d.sifat}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{d.batas_waktu}</td>
                  <td className="px-6 py-4 text-sm italic text-slate-600">"{d.isi}"</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(d)}
                        className="text-slate-400 hover:text-emerald-500 transition-colors p-2"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(d.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {disposisi.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Belum ada data disposisi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold">{editingId ? 'Edit Disposisi' : 'Tambah Disposisi'}</h3>
                <button onClick={() => { setShowModal(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Pilih Surat</label>
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={formData.surat_id}
                    onChange={(e) => setFormData({...formData, surat_id: e.target.value})}
                  >
                    <option value="">-- Pilih Surat --</option>
                    {surat.map(s => (
                      <option key={s.id} value={s.id}>{s.no_surat} - {s.perihal}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Tujuan Disposisi (Bisa pilih lebih dari 1)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {daftarTujuan.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTujuan(t)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedTujuan.includes(t)
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Sifat</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={formData.sifat}
                      onChange={(e) => setFormData({...formData, sifat: e.target.value})}
                    >
                      <option value="Biasa">Biasa</option>
                      <option value="Segera">Segera</option>
                      <option value="Penting">Penting</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Isi Instruksi</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={formData.isi}
                    onChange={(e) => setFormData({...formData, isi: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Batas Waktu</label>
                    <input 
                      type="date"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={formData.batas_waktu}
                      onChange={(e) => setFormData({...formData, batas_waktu: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Catatan Tambahan</label>
                  <textarea 
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={formData.catatan}
                    onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => { setShowModal(false); setEditingId(null); }}
                    className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className={`bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {saving && <Clock className="animate-spin" size={18} />}
                    {saving ? 'Menyimpan...' : 'Simpan Disposisi'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AgendaView = () => {
  const [agenda, setAgenda] = useState<Agenda[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nama_kegiatan: '',
    tanggal: '',
    waktu: '',
    lokasi: '',
    keterangan: ''
  });

  const fetchAgenda = async () => {
    const res = await fetch('/api/agenda');
    setAgenda(await res.json());
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/agenda/${editingId}` : '/api/agenda';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        setEditingId(null);
        fetchAgenda();
        setFormData({
          nama_kegiatan: '',
          tanggal: '',
          waktu: '',
          lokasi: '',
          keterangan: ''
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Gagal menyimpan agenda: ${errorData.error || 'Terjadi kesalahan pada server.'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan agenda.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (a: Agenda) => {
    setEditingId(a.id);
    setFormData({
      nama_kegiatan: a.nama_kegiatan,
      tanggal: a.tanggal,
      waktu: a.waktu,
      lokasi: a.lokasi,
      keterangan: a.keterangan
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus agenda ini?')) {
      try {
        const res = await fetch(`/api/agenda/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchAgenda();
        } else {
          alert('Gagal menghapus agenda.');
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan saat menghapus agenda.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agenda Kegiatan</h2>
          <p className="text-slate-500">Jadwal kegiatan dan rapat mendatang.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus size={20} />
          Tambah Kegiatan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agenda.map((a) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={a.id} 
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                {a.tanggal}
              </div>
              <div className="text-slate-400">
                <Clock size={18} />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">{a.nama_kegiatan}</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" /> {a.waktu}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" /> {a.lokasi}
              </p>
            </div>
            {a.keterangan && (
              <p className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500 italic">
                "{a.keterangan}"
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button 
                onClick={() => handleEdit(a)}
                className="text-slate-400 hover:text-emerald-500 transition-colors p-2"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(a.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
        {agenda.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
            Belum ada agenda kegiatan.
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold">{editingId ? 'Edit Agenda' : 'Tambah Agenda'}</h3>
                <button onClick={() => { setShowModal(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Nama Kegiatan</label>
                  <input 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={formData.nama_kegiatan}
                    onChange={(e) => setFormData({...formData, nama_kegiatan: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Tanggal</label>
                    <input 
                      type="date"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={formData.tanggal}
                      onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Waktu</label>
                    <input 
                      type="time"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={formData.waktu}
                      onChange={(e) => setFormData({...formData, waktu: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Lokasi</label>
                  <input 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Keterangan</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className={`bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {saving && <Clock className="animate-spin" size={18} />}
                    {saving ? 'Menyimpan...' : 'Simpan Agenda'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SearchView = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SuratMasuk[]>([]);
  const [selectedSurat, setSelectedSurat] = useState<SuratMasuk | null>(null);
  const [disposisiTerkait, setDisposisiTerkait] = useState<Disposisi[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search-surat?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setSelectedSurat(null);
      setDisposisiTerkait([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (surat: SuratMasuk) => {
    setSelectedSurat(surat);
    try {
      const res = await fetch(`/api/disposisi/${surat.id}`);
      const data = await res.json();
      setDisposisiTerkait(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSurat = async (id: number) => {
    if (confirm('Yakin ingin menghapus surat ini? Seluruh disposisi terkait juga akan dihapus.')) {
      try {
        const res = await fetch(`/api/surat-masuk/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setResults(results.filter(s => s.id !== id));
          setSelectedSurat(null);
          setDisposisiTerkait([]);
        }
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus surat.');
      }
    }
  };

  const handleDeleteDisposisi = async (id: number) => {
    if (confirm('Yakin ingin menghapus disposisi ini?')) {
      try {
        const res = await fetch(`/api/disposisi/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setDisposisiTerkait(disposisiTerkait.filter(d => d.id !== id));
        }
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus disposisi.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Pencarian Surat</h2>
        <p className="text-slate-500">Cari surat berdasarkan nomor, perihal, atau asal surat.</p>
      </header>

      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <input 
          type="text"
          placeholder="Masukkan kata kunci pencarian..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
        >
          Cari
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Hasil Pencarian ({results.length})</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {results.map((s) => (
              <button
                key={s.id}
                onClick={() => viewDetails(s)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedSurat?.id === s.id 
                    ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-200' 
                    : 'bg-white border-slate-200 hover:border-emerald-200'
                }`}
              >
                <p className="text-xs font-mono text-emerald-600 mb-1">{s.no_surat}</p>
                <p className="font-bold text-slate-900 line-clamp-1">{s.perihal}</p>
                <p className="text-xs text-slate-500 mt-1">{s.asal_surat}</p>
              </button>
            ))}
            {results.length === 0 && !loading && query && (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
                Tidak ada hasil ditemukan.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedSurat ? (
              <motion.div
                key={selectedSurat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                        Preview Surat
                      </span>
                      <button 
                        onClick={() => handleDeleteSurat(selectedSurat.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Hapus Surat"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {selectedSurat.file_path && (
                      <a 
                        href={selectedSurat.file_path} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold text-sm"
                      >
                        <Download size={16} /> Unduh Dokumen
                      </a>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedSurat.perihal}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 uppercase text-[10px] font-bold tracking-widest">Nomor Surat</p>
                      <p className="font-medium">{selectedSurat.no_surat}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 uppercase text-[10px] font-bold tracking-widest">Asal Surat</p>
                      <p className="font-medium">{selectedSurat.asal_surat}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 uppercase text-[10px] font-bold tracking-widest">Tanggal Surat</p>
                      <p className="font-medium">{selectedSurat.tgl_surat}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 uppercase text-[10px] font-bold tracking-widest">Nomor Agenda</p>
                      <p className="font-medium">{selectedSurat.no_agenda}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider mb-6 flex items-center gap-2">
                    <FileText size={16} /> Disposisi Terkait ({disposisiTerkait.length})
                  </h4>
                  <div className="space-y-4">
                    {disposisiTerkait.map((d) => (
                      <div key={d.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                          <p className="font-bold text-slate-900">{d.tujuan}</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              d.sifat === 'Penting' ? 'bg-red-100 text-red-600' : 
                              d.sifat === 'Segera' ? 'bg-amber-100 text-amber-600' : 
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {d.sifat}
                            </span>
                            <button 
                              onClick={() => handleDeleteDisposisi(d.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 italic mb-3">"{d.isi}"</p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1"><Clock size={12} /> Batas: {d.batas_waktu}</span>
                        </div>
                      </div>
                    ))}
                    {disposisiTerkait.length === 0 && (
                      <div className="py-8 text-center text-slate-400 italic text-sm">
                        Belum ada disposisi untuk surat ini.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="font-medium">Pilih surat dari hasil pencarian untuk melihat detail dan disposisi.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<Stats>({ suratCount: 0, disposisiCount: 0, agendaCount: 0 });

  const fetchStats = async () => {
    const res = await fetch('/api/stats');
    setStats(await res.json());
  };

  useEffect(() => {
    fetchStats();
  }, [activeTab]);

  return (
    <div className="min-h-screen flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard stats={stats} />}
              {activeTab === 'surat-masuk' && <SuratMasukView />}
              {activeTab === 'disposisi' && <DisposisiView />}
              {activeTab === 'agenda' && <AgendaView />}
              {activeTab === 'pencarian' && <SearchView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
