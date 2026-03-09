import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Settings, User as UserIcon, Bell, CreditCard, LogOut, Moon, Sun, Monitor, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('settings');
  const [isUpdating, setIsUpdating] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          setProfileData(doc.data());
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t("profile.pleaseLogIn")}</h2>
        </div>
      </div>
    );
  }

  const handleUpdatePreference = async (key: string, value: any) => {
    if (!user || !profileData) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        [`preferences.${key}`]: value,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveInstitution = async (id: string) => {
    if (!user || !profileData) return;
    setIsUpdating(true);
    try {
      const newInstitutions = profileData.linkedInstitutions.filter((inst: any) => inst.id !== id);
      await updateDoc(doc(db, 'users', user.uid), {
        linkedInstitutions: newInstitutions,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddMockInstitution = async () => {
    if (!user || !profileData) return;
    setIsUpdating(true);
    try {
      const newInst = {
        id: `inst_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Chase Bank',
        type: 'checking',
        status: 'active',
        lastSynced: new Date().toISOString()
      };
      await updateDoc(doc(db, 'users', user.uid), {
        linkedInstitutions: [...(profileData.linkedInstitutions || []), newInst],
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-card border border-border rounded-2xl p-6 mb-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-accent-purple/20 flex items-center justify-center mb-4 overflow-hidden">
              {profileData?.photoURL ? (
                <img src={profileData.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-12 h-12 text-accent-purple" />
              )}
            </div>
            <h2 className="text-xl font-bold">{profileData?.displayName || 'User'}</h2>
            <p className="text-sm text-muted-foreground mb-6">{profileData?.email}</p>
            
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t("profile.signOut")}
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: 'settings', label: t("profile.accountSettings"), icon: Settings },
              { id: 'preferences', label: t("profile.preferences"), icon: Bell },
              { id: 'institutions', label: t("profile.linkedAccounts"), icon: CreditCard },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent/50 text-foreground'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[500px]"
          >
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{t("profile.accountSettings")}</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t("profile.displayName")}</label>
                    <input 
                      type="text" 
                      value={profileData?.displayName || ''} 
                      disabled
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 opacity-70 cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-2">{t("profile.managedByGoogle")}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t("profile.emailAddress")}</label>
                    <input 
                      type="email" 
                      value={profileData?.email || ''} 
                      disabled
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 opacity-70 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{t("profile.preferences")}</h2>
                
                <div className="space-y-8">
                  {/* Theme */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("profile.theme")}</h3>
                    <div className="flex gap-4">
                      {[
                        { id: 'light', icon: Sun, label: t("profile.light") },
                        { id: 'dark', icon: Moon, label: t("profile.dark") },
                        { id: 'system', icon: Monitor, label: t("profile.system") }
                      ].map(theme => (
                        <button
                          key={theme.id}
                          disabled={isUpdating}
                          onClick={() => handleUpdatePreference('theme', theme.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                            profileData?.preferences?.theme === theme.id
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50 text-muted-foreground'
                          }`}
                        >
                          <theme.icon className="w-6 h-6" />
                          <span className="text-sm font-medium">{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{t("profile.pushNotifications")}</h3>
                      <p className="text-sm text-muted-foreground">{t("profile.pushNotificationsDesc")}</p>
                    </div>
                    <button
                      disabled={isUpdating}
                      onClick={() => handleUpdatePreference('notifications', !profileData?.preferences?.notifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profileData?.preferences?.notifications ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profileData?.preferences?.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <hr className="border-border" />

                  {/* Currency */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("profile.defaultCurrency")}</h3>
                    <select
                      disabled={isUpdating}
                      value={profileData?.preferences?.currency || 'USD'}
                      onChange={(e) => handleUpdatePreference('currency', e.target.value)}
                      className="bg-background border border-border rounded-lg px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'institutions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{t("profile.linkedAccounts")}</h2>
                  <button 
                    onClick={handleAddMockInstitution}
                    disabled={isUpdating}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    {t("profile.linkAccount")}
                  </button>
                </div>

                {(!profileData?.linkedInstitutions || profileData.linkedInstitutions.length === 0) ? (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                    <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">{t("profile.noAccounts")}</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      {t("profile.linkAccountsDesc")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profileData.linkedInstitutions.map((inst: any) => (
                      <div key={inst.id} className="flex items-center justify-between p-4 border border-border rounded-xl bg-background/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-accent-purple" />
                          </div>
                          <div>
                            <h4 className="font-medium">{inst.name}</h4>
                            <p className="text-xs text-muted-foreground capitalize">{inst.type} • {t("profile.lastSynced")}: {new Date(inst.lastSynced).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            inst.status === 'active' ? 'bg-green-500/10 text-green-500' : 
                            inst.status === 'error' ? 'bg-red-500/10 text-red-500' : 
                            'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {inst.status}
                          </span>
                          <button 
                            onClick={() => handleRemoveInstitution(inst.id)}
                            disabled={isUpdating}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
