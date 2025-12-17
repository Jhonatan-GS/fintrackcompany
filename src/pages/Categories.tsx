import { useState, useEffect } from "react";
import { Plus, X, Trash2, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  is_income: boolean;
  is_global: boolean;
}

const EMOJI_OPTIONS = ['📦', '🎮', '🎵', '📷', '💻', '🏋️', '🎨', '🍕', '☕', '🎁', '✈️', '🐕', '💅', '🔧'];
const COLOR_OPTIONS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'];

const CategoriesPage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '📦',
    color: '#22c55e',
    is_income: false
  });
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadCategories();
    }
  }, [user?.id]);

  const loadCategories = async () => {
    if (!user?.id) return;
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`is_global.eq.true,user_id.eq.${user.id}`)
      .order('is_global', { ascending: false })
      .order('sort_order');

    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  const globalExpenseCategories = categories.filter(c => c.is_global && !c.is_income);
  const globalIncomeCategories = categories.filter(c => c.is_global && c.is_income);
  const customCategories = categories.filter(c => !c.is_global);

  const createCategory = async () => {
    if (!newCategory.name.trim() || !user?.id) {
      toast.error('Ingresa un nombre para la categoría');
      return;
    }

    setIsCreating(true);
    const { error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name: newCategory.name.trim(),
        slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
        icon: newCategory.icon,
        color: newCategory.color,
        is_global: false,
        is_income: newCategory.is_income
      });

    if (error) {
      toast.error('Error al crear categoría');
    } else {
      toast.success('Categoría creada!');
      loadCategories();
      setShowModal(false);
      setNewCategory({ name: '', icon: '📦', color: '#22c55e', is_income: false });
    }
    setIsCreating(false);
  };

  const deleteCategory = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('is_global', false);

    if (error) {
      toast.error('Error al eliminar categoría');
    } else {
      toast.success('Categoría eliminada');
      loadCategories();
    }
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Categorías</h1>
        <p className="text-muted-foreground">
          Administra las categorías para clasificar tus transacciones
        </p>
      </div>

      {/* Global Categories Info */}
      <div className="bg-muted/30 rounded-2xl p-5 border border-border/50">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Categorías preestablecidas</h3>
            <p className="text-sm text-muted-foreground">
              Estas categorías son globales y la IA las usa para clasificar automáticamente tus transacciones.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Expense Categories */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Gastos</p>
            <div className="flex flex-wrap gap-2">
              {globalExpenseCategories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 text-sm text-muted-foreground"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Income Categories */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Ingresos</p>
            <div className="flex flex-wrap gap-2">
              {globalIncomeCategories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 text-sm text-muted-foreground"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Mis categorías personalizadas</h3>
          <Button
            onClick={() => setShowModal(true)}
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva categoría
          </Button>
        </div>

        {customCategories.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground mb-2">No tienes categorías personalizadas</p>
            <p className="text-sm text-muted-foreground">
              Crea categorías adicionales para organizar mejor tus gastos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    {cat.icon}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cat.is_income ? 'Ingreso' : 'Gasto'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCategory(cat.id)}
                  disabled={deletingId === cat.id}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Crear nueva categoría</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
                <Input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Ej: Mascotas, Hobbies..."
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tipo</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!newCategory.is_income}
                      onChange={() => setNewCategory({ ...newCategory, is_income: false })}
                      className="accent-primary"
                    />
                    <span className="text-foreground">Gasto</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={newCategory.is_income}
                      onChange={() => setNewCategory({ ...newCategory, is_income: true })}
                      className="accent-primary"
                    />
                    <span className="text-foreground">Ingreso</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ícono</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewCategory({ ...newCategory, icon: emoji })}
                      className={cn(
                        "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                        newCategory.icon === emoji
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all",
                        newCategory.color === color && "ring-2 ring-offset-2 ring-offset-card ring-foreground"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={createCategory}
                disabled={isCreating || !newCategory.name.trim()}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isCreating ? 'Creando...' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
