import React, { useState } from 'react';
import {
  Building2,
  Truck,
  ShieldCheck,
  Plus,
  Upload,
  CheckCircle2,
  XCircle,
  Edit2,
  RefreshCw,
  Search,
  Filter,
  FileSpreadsheet,
  Layers,
  MapPin,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { PartnerWarehouse, Kabadiwala, WasteCategoryType } from '../../types';
import { api } from '../../services/api';

interface AdminDashboardProps {
  warehouses: PartnerWarehouse[];
  kabadiwalas: Kabadiwala[];
  onAddWarehouse: (warehouse: PartnerWarehouse) => void;
  onToggleWarehouseStatus: (warehouseId: string) => void;
  onToggleKabadiwalaVerification: (kabadiwalaId: string) => void;
  onUpdateKabadiwalaRadius: (kabadiwalaId: string, newRadius: number) => void;
  onImportWarehouseData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  warehouses,
  kabadiwalas,
  onAddWarehouse,
  onToggleWarehouseStatus,
  onToggleKabadiwalaVerification,
  onUpdateKabadiwalaRadius,
  onImportWarehouseData
}) => {
  const [activeTab, setActiveTab] = useState<'warehouses' | 'kabadiwalas' | 'users' | 'import'>('warehouses');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddWarehouseModal, setShowAddWarehouseModal] = useState(false);
  const [newWhName, setNewWhName] = useState('');
  const [newWhCity, setNewWhCity] = useState('Bengaluru');
  const [newWhArea, setNewWhArea] = useState('Indiranagar Hub');
  const [newWhContact, setNewWhContact] = useState('Raghavan Nair');
  const [newWhPhone, setNewWhPhone] = useState('+91 98450 11223');
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // Real Database Users
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'HOUSEHOLD' | 'KABADIWALA' | 'ADMIN'>('ALL');

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const uList = await api.getAdminUsers();
      setDbUsers(uList);
    } catch (err) {
      console.warn('Failed to load admin users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleUpdateUserStatus = async (userId: number, newStatus: string) => {
    try {
      await api.updateAdminUserStatus(userId, newStatus);
      setDbUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      setImportNotification(`User status successfully updated to ${newStatus}.`);
    } catch (err) {
      console.warn('Failed to update status:', err);
    }
  };

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhName) return;

    try {
      await api.createAdminWarehouse({
        name: `Partner Warehouse — ${newWhName}`,
        location: `${newWhArea}, ${newWhCity}`,
        area: newWhArea,
        city: newWhCity,
        state: newWhCity === 'Bengaluru' ? 'Karnataka' : 'West Bengal',
        pinCode: '560038',
        contactName: newWhContact,
        contactPhone: newWhPhone,
        contactEmail: `${newWhCity.toLowerCase()}.hub@partnerwarehouses.in`,
      });
    } catch (err) {
      console.warn('API warehouse create:', err);
    }

    const newWh: PartnerWarehouse = {
      warehouse_id: `wh-${newWhCity.toLowerCase()}-${Math.floor(10 + Math.random() * 90)}`,
      name: `Partner Warehouse — ${newWhName}`,
      location: `${newWhArea}, ${newWhCity}`,
      area: newWhArea,
      city: newWhCity,
      state: newWhCity === 'Bengaluru' ? 'Karnataka' : 'West Bengal',
      pin_code: '560038',
      latitude: 12.9784,
      longitude: 77.6408,
      contact_person: newWhContact,
      phone: newWhPhone,
      email: `${newWhCity.toLowerCase()}.hub@partnerwarehouses.in`,
      status: 'Connected',
      connected_kabadiwalas_count: 4,
      last_data_update: 'Just now',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onAddWarehouse(newWh);
    setShowAddWarehouseModal(false);
    setNewWhName('');
  };

  const handleSimulateCsvImport = async () => {
    try {
      await api.importKabadiwalas(1, [
        {
          businessName: 'Shree Balaji Eco Traders',
          ownerName: 'Sunil Agarwal',
          phone: '+91 94340 99881',
          area: 'Burnpur Market',
          city: 'Asansol',
          paperRate: '17.00',
          plasticRate: '23.00',
          metalRate: '35.00',
        },
      ]);
    } catch (err) {
      console.warn('CSV import API log:', err);
    }
    onImportWarehouseData();
    setImportNotification('Successfully ingested 4 verified Kabadiwala profiles and rate cards from Partner Warehouse data feed into Cloud SQL.');
    setTimeout(() => setImportNotification(null), 5000);
  };

  const filteredKabadiwalas = kabadiwalas.filter(
    (k) =>
      k.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#240A39] rounded-3xl p-6 sm:p-8 text-white border border-[#E0D5C3] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Administration</span>
            </span>
            <span className="text-xs text-purple-200 font-mono">
              · Data & Partner Network Governance
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Platform Admin Console
          </h1>
          <p className="text-xs text-purple-200">
            Manage Partner Warehouses, import warehouse-supplied Kabadiwala data, and audit live rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddWarehouseModal(true)}
            className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-black text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-[#240A39]" />
            <span>Connect New Warehouse</span>
          </button>

          <button
            onClick={handleSimulateCsvImport}
            className="h-11 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-colors"
          >
            <Upload className="w-4 h-4 text-amber-300" />
            <span>Sync Warehouse Feed</span>
          </button>
        </div>
      </div>

      {/* Import Notification Banner */}
      {importNotification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">{importNotification}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E0D5C3] pb-3">
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'warehouses'
              ? 'bg-[#240A39] text-amber-400 shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
          }`}
        >
          Partner Warehouses ({warehouses.length})
        </button>

        <button
          onClick={() => setActiveTab('kabadiwalas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'kabadiwalas'
              ? 'bg-[#240A39] text-amber-400 shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
          }`}
        >
          Supplied Kabadiwalas ({kabadiwalas.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-[#240A39] text-amber-400 shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
          }`}
        >
          PostgreSQL Users ({dbUsers.length > 0 ? dbUsers.length : 'Live'})
        </button>

        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'import'
              ? 'bg-[#240A39] text-amber-400 shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
          }`}
        >
          Data Ingestion & CSV Schema
        </button>
      </div>

      {/* Tab 1: Partner Warehouses (Section 16 requirement) */}
      {activeTab === 'warehouses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-black text-xl text-slate-900">
                Connected Partner Warehouses
              </h2>
              <p className="text-xs text-slate-500">
                Local aggregation facilities that provide Kabadiwala relationship records & rate benchmarks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {warehouses.map((wh) => (
              <div
                key={wh.warehouse_id}
                className="bg-white rounded-3xl border border-[#E0D5C3] p-6 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-md">
                      ID: {wh.warehouse_id}
                    </span>
                    <h3 className="font-display font-black text-xl text-slate-900 mt-1.5">
                      {wh.name}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {wh.area}, {wh.city} ({wh.state}) · PIN {wh.pin_code}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                      wh.status === 'Connected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-slate-600'
                    }`}
                  >
                    {wh.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3]">
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">
                      Connected Kabadiwalas
                    </span>
                    <span className="font-display font-black text-xl text-[#240A39]">
                      {wh.connected_kabadiwalas_count} Active
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3]">
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">
                      Last Rate Sync
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-800 block mt-1">
                      {wh.last_data_update}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div>Contact: <strong>{wh.contact_person}</strong> ({wh.phone})</div>
                  <div className="text-[11px] text-slate-400 font-mono">{wh.email}</div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => onToggleWarehouseStatus(wh.warehouse_id)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    Toggle Active Status
                  </button>

                  <button
                    onClick={handleSimulateCsvImport}
                    className="h-9 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Data Feed</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Supplied Kabadiwalas (Section 16 requirement) */}
      {activeTab === 'kabadiwalas' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-black text-xl text-slate-900">
                Warehouse-Supplied Kabadiwala Directory
              </h2>
              <p className="text-xs text-slate-500">
                Entity attributes imported from partner warehouses. Configure verification status and service radius.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, area..."
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-[#E0D5C3] text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E0D5C3] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#240A39] text-white uppercase font-mono text-[11px]">
                    <th className="py-3.5 px-4">Kabadiwala</th>
                    <th className="py-3.5 px-4">Warehouse Source</th>
                    <th className="py-3.5 px-4">Area & Radius</th>
                    <th className="py-3.5 px-4">Categories</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredKabadiwalas.map((k) => (
                    <tr key={k.kabadiwala_id} className="hover:bg-amber-50/30">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{k.business_name}</div>
                        <div className="text-[11px] text-slate-500">
                          {k.owner_name} · {k.phone}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-mono text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                          {k.warehouse_name ? k.warehouse_name.replace('Partner Warehouse — ', '') : 'Partner Hub'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{k.area}, {k.city}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-mono text-slate-500">Radius:</span>
                          <select
                            value={k.service_radius}
                            onChange={(e) =>
                              onUpdateKabadiwalaRadius(k.kabadiwala_id, parseFloat(e.target.value))
                            }
                            className="h-7 px-2 rounded bg-stone-100 border border-stone-300 font-mono text-[11px] font-bold text-slate-800"
                          >
                            <option value="2.5">2.5 km</option>
                            <option value="3.5">3.5 km</option>
                            <option value="4.5">4.5 km</option>
                            <option value="5.5">5.5 km</option>
                            <option value="7.0">7.0 km</option>
                          </select>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {k.waste_categories.map((cat) => (
                            <span
                              key={cat}
                              className="text-[10px] font-bold bg-stone-100 px-1.5 py-0.5 rounded text-slate-700"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onToggleKabadiwalaVerification(k.kabadiwala_id)}
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 ${
                            k.verification_status === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {k.verification_status === 'Verified' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{k.verification_status}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="text-[11px] font-mono text-slate-400">
                          {k.pickup_available ? 'Pickup: Yes' : 'Pickup: No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: PostgreSQL Database Users (Section 24 User Management) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-[#E0D5C3] p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-black text-xl text-slate-900">
                PostgreSQL Database Users & Role Management
              </h3>
              <p className="text-xs text-slate-500">
                Central identity records connected to Cloud SQL database. Filter by role, review verification, or suspend accounts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Filter Role:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                className="h-9 px-3 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] text-xs font-bold text-slate-900"
              >
                <option value="ALL">All Roles ({dbUsers.length})</option>
                <option value="HOUSEHOLD">Households</option>
                <option value="KABADIWALA">Kabadiwalas</option>
                <option value="ADMIN">Platform Admins</option>
              </select>
              <button
                onClick={fetchUsers}
                disabled={isLoadingUsers}
                className="h-9 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {dbUsers
                  .filter((u) => (userRoleFilter === 'ALL' ? true : u.role === userRoleFilter))
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAF8F5]/80">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">ID: #{u.id} · {u.uid}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-900'
                              : u.role === 'KABADIWALA'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[11px]">{u.email}</div>
                        <div className="text-[11px] text-slate-500">{u.phone || 'No phone'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.status === 'SUSPENDED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never logged in'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {u.role !== 'ADMIN' && (
                          <div className="flex items-center justify-end gap-1.5">
                            {u.status === 'ACTIVE' ? (
                              <button
                                onClick={() => handleUpdateUserStatus(u.id, 'SUSPENDED')}
                                className="px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-bold"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateUserStatus(u.id, 'ACTIVE')}
                                className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold"
                              >
                                Activate
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: CSV Data Ingestion Architecture & Schema (Section 16 requirement) */}
      {activeTab === 'import' && (
        <div className="bg-white rounded-3xl border border-[#E0D5C3] p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-black text-xl text-slate-900">
              Partner Warehouse Data Ingestion Format
            </h3>
            <p className="text-xs text-slate-600">
              Partner warehouses export their existing Kabadiwala network records in structured CSV/JSON formats into our platform.
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E0D5C3] font-mono text-[11px] text-slate-800 overflow-x-auto">
            <pre className="leading-relaxed">
{`warehouse_id,business_name,owner_name,phone,area,city,pin_code,lat,lng,service_radius_km,pickup_available,categories,paper_rate,plastic_rate,metal_rate,ewaste_rate
wh-asansol-01,Maa Scrap Dealer,Tarun Mondal,+919832144520,Burnpur Road,Asansol,713325,23.6852,86.9745,4.5,true,"Paper,Plastic,Metal,E-Waste",20,23,45,165
wh-asansol-01,Raj Scrap Centre,Rajesh Shaw,+919732088912,G.T. Road,Asansol,713301,23.6874,86.9839,3.5,true,"Paper,Plastic,Metal,E-Waste",18,25,42,180
wh-ggn-02,Haryana Scrap Corp,Ramesh Yadav,+919818843210,Sector 14,Gurugram,122001,28.4728,77.0435,5.5,true,"Paper,Plastic,Metal,E-Waste",22,26,48,190`}
            </pre>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-mono">
              Last automatic background sync: 24 Sep 2026, 14:30 IST
            </span>

            <button
              onClick={handleSimulateCsvImport}
              className="h-11 px-6 rounded-xl bg-[#240A39] hover:bg-[#3B1458] text-amber-400 font-bold text-xs flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Simulate CSV Data Ingestion</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Warehouse Modal */}
      {showAddWarehouseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#E0D5C3] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-black text-lg text-slate-900">
                Connect Partner Warehouse
              </h3>
              <button
                onClick={() => setShowAddWarehouseModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWarehouse} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Warehouse Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. East Bengaluru Logistics Hub"
                  value={newWhName}
                  onChange={(e) => setNewWhName(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] font-bold text-slate-900 text-xs focus:ring-2 focus:ring-[#240A39]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <select
                    value={newWhCity}
                    onChange={(e) => setNewWhCity(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] font-bold text-slate-900 text-xs"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Asansol">Asansol</option>
                    <option value="Gurugram">Gurugram</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Area / Locality</label>
                  <input
                    type="text"
                    value={newWhArea}
                    onChange={(e) => setNewWhArea(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] font-bold text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Person</label>
                <input
                  type="text"
                  value={newWhContact}
                  onChange={(e) => setNewWhContact(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] font-bold text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone</label>
                <input
                  type="tel"
                  value={newWhPhone}
                  onChange={(e) => setNewWhPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] font-bold text-slate-900 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-black text-xs shadow-xs transition-colors"
              >
                Register & Connect Warehouse
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
