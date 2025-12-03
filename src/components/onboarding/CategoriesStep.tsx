import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  is_income: boolean;
  is_global: boolean;
}

interface CategoriesStepProps {
  userId: string;
  onComplete: () => void;
  onBack: () => void;
}

const EMOJI_OPTIONS = ['📦', '🎮', '🎵', '📷', '💻', '🏋️', '🎨', '🍕', '☕', '🎁', '✈️', '🐕', '💅', '🔧'];
const COLOR_OPTIONS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'];

export const CategoriesStep = ({ userId, onComplete, onBack }: CategoriesStepProps) => {
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

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`is_global.eq.true,user_id.eq.${userId}`)
      .order('sort_order');

    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  const expenseCategories = categories.filter(c => !c.is_income);
  const incomeCategories = categories.filter(c => c.is_income);

  const createCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Ingresa un nombre para la categoría');
      return;
    }

    setIsCreating(true);
    const { error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl mb-4">🏷️</div>
        <h2 className="text-2xl font-bold text-foreground">Tus categorías</h2>
        <p className="text-muted-foreground">
          Estas son las categorías predeterminadas. Puedes personalizarlas después en Ajustes.
        </p>
      </div>

      {/* Expense Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Gastos</h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {expenseCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col items-center p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span className="text-xs text-foreground text-center line-clamp-1">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Income Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Ingresos</h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {incomeCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col items-center p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span className="text-xs text-foreground text-center line-clamp-1">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Create button */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="w-4 h-4" />
        Crear categoría personalizada
      </button>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={onComplete}
          className="px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        >
          Finalizar ✓
        </button>
      </div>

      {/* Create Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4 space-y-4">
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
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Mi categoría"
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={createCategory}
                disabled={isCreating}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
