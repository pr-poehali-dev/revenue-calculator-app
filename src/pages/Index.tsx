import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

const CATEGORIES = {
  income: ['Зарплата', 'Фриланс', 'Инвестиции', 'Прочее'],
  expense: ['Продукты', 'Транспорт', 'Развлечения', 'Жильё', 'Здоровье', 'Образование', 'Прочее']
};

const COLORS = ['#2AABEE', '#34C759', '#FF3B30', '#FF9500', '#AF52DE', '#5856D6', '#FF2D55'];

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'income', amount: 50000, category: 'Зарплата', description: 'Ежемесячная зарплата', date: '2024-10-01' },
    { id: '2', type: 'expense', amount: 15000, category: 'Продукты', description: 'Покупки в магазине', date: '2024-10-05' },
    { id: '3', type: 'expense', amount: 5000, category: 'Транспорт', description: 'Проездной на месяц', date: '2024-10-07' },
    { id: '4', type: 'expense', amount: 8000, category: 'Развлечения', description: 'Кино и кафе', date: '2024-10-10' },
    { id: '5', type: 'income', amount: 15000, category: 'Фриланс', description: 'Веб-проект', date: '2024-10-12' },
    { id: '6', type: 'expense', amount: 20000, category: 'Жильё', description: 'Аренда квартиры', date: '2024-10-15' }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const expensesByCategory = CATEGORIES.expense.map(cat => ({
    name: cat,
    value: transactions.filter(t => t.type === 'expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0)
  })).filter(item => item.value > 0);

  const monthlyData = [
    { month: 'Сен', income: 45000, expense: 35000 },
    { month: 'Окт', income: totalIncome, expense: totalExpense },
  ];

  const handleAddTransaction = () => {
    if (!amount || !category) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTransaction, ...transactions]);
    setIsDialogOpen(false);
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Финансы</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                <Icon name="Plus" className="mr-2" size={20} />
                Добавить
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Новая транзакция</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Tabs value={transactionType} onValueChange={(v) => setTransactionType(v as 'income' | 'expense')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="income" className="data-[state=active]:bg-success data-[state=active]:text-white">
                      Доход
                    </TabsTrigger>
                    <TabsTrigger value="expense" className="data-[state=active]:bg-destructive data-[state=active]:text-white">
                      Расход
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-2">
                  <Label htmlFor="amount">Сумма</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES[transactionType].map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Input
                    id="description"
                    placeholder="Описание транзакции"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <Button onClick={handleAddTransaction} className="w-full bg-primary hover:bg-primary/90">
                  Добавить транзакцию
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 animate-scale-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Баланс</p>
                <p className="text-3xl font-bold text-foreground">{balance.toLocaleString()} ₽</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Wallet" className="text-primary" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Доходы</p>
                <p className="text-3xl font-bold text-success">{totalIncome.toLocaleString()} ₽</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Icon name="ArrowUp" className="text-success" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Расходы</p>
                <p className="text-3xl font-bold text-destructive">{totalExpense.toLocaleString()} ₽</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Icon name="ArrowDown" className="text-destructive" size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Динамика за 2 месяца</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#34C759" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill="#FF3B30" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-semibold mb-4">Расходы по категориям</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold mb-4">Последние транзакции</h2>
          <div className="space-y-3">
            {transactions.slice(0, 8).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                  }`}>
                    <Icon
                      name={transaction.type === 'income' ? 'ArrowUp' : 'ArrowDown'}
                      className={transaction.type === 'income' ? 'text-success' : 'text-destructive'}
                      size={20}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.category}</p>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} ₽
                  </p>
                  <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString('ru')}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <Icon name="TrendingUp" size={24} />
            <span className="text-xs">Статистика</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <Icon name="Target" size={24} />
            <span className="text-xs">Бюджет</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <Icon name="Download" size={24} />
            <span className="text-xs">Экспорт</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <Icon name="FolderOpen" size={24} />
            <span className="text-xs">Категории</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <Icon name="Settings" size={24} />
            <span className="text-xs">Настройки</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
