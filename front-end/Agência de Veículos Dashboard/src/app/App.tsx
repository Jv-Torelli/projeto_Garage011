import { useState } from "react";
import { LayoutDashboard, Car, Receipt, FileText } from "lucide-react";
import { Dashboard } from "./components/dashboard";
import { Inventory, type Vehicle } from "./components/inventory";
import { Transactions, type Transaction } from "./components/transactions";
import { Reports } from "./components/reports";
import { Button } from "./components/ui/button";

type Page = "dashboard" | "inventory" | "transactions" | "reports";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  
  // Mock data para veículos
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      color: "Prata",
      price: 145000,
      fipePrice: 142000,
      status: "available",
    },
    {
      id: "2",
      brand: "Honda",
      model: "Civic",
      year: 2022,
      color: "Preto",
      price: 138000,
      fipePrice: 135000,
      status: "available",
    },
    {
      id: "3",
      brand: "Volkswagen",
      model: "Jetta",
      year: 2023,
      color: "Branco",
      price: 152000,
      fipePrice: 150000,
      status: "available",
    },
    {
      id: "4",
      brand: "Chevrolet",
      model: "Onix",
      year: 2024,
      color: "Vermelho",
      price: 89000,
      fipePrice: 87000,
      status: "available",
    },
    {
      id: "5",
      brand: "Hyundai",
      model: "HB20",
      year: 2023,
      color: "Azul",
      price: 78000,
      fipePrice: 76000,
      status: "sold",
    },
  ]);

  // Mock data para transações
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Novembro 2024
    {
      id: "1",
      clientId: "client-1",
      clientName: "João Silva",
      clientCpf: "123.456.789-00",
      vehicleId: "5",
      vehicleBrand: "Hyundai",
      vehicleModel: "HB20",
      vehicleYear: 2023,
      salePrice: 78000,
      date: "2024-11-05T10:00:00Z",
      paymentMethod: "financing",
      tradeInVehicle: {
        brand: "Fiat",
        model: "Palio",
        year: 2015,
        fipePrice: 35000,
        entryValue: 29750,
      },
    },
    {
      id: "2",
      clientId: "client-2",
      clientName: "Maria Santos",
      clientCpf: "987.654.321-00",
      vehicleId: "2",
      vehicleBrand: "Honda",
      vehicleModel: "Civic",
      vehicleYear: 2022,
      salePrice: 138000,
      date: "2024-11-12T14:30:00Z",
      paymentMethod: "cash",
    },
    {
      id: "3",
      clientId: "client-3",
      clientName: "Carlos Oliveira",
      clientCpf: "456.789.123-00",
      vehicleId: "1",
      vehicleBrand: "Toyota",
      vehicleModel: "Corolla",
      vehicleYear: 2023,
      salePrice: 145000,
      date: "2024-11-20T09:15:00Z",
      paymentMethod: "trade-in",
      tradeInVehicle: {
        brand: "Ford",
        model: "Focus",
        year: 2018,
        fipePrice: 55000,
        entryValue: 46750,
      },
    },
    // Dezembro 2024
    {
      id: "4",
      clientId: "client-4",
      clientName: "Ana Paula Costa",
      clientCpf: "111.222.333-44",
      vehicleId: "4",
      vehicleBrand: "Chevrolet",
      vehicleModel: "Onix",
      vehicleYear: 2024,
      salePrice: 89000,
      date: "2024-12-02T11:00:00Z",
      paymentMethod: "financing",
    },
    {
      id: "5",
      clientId: "client-5",
      clientName: "Pedro Henrique Lima",
      clientCpf: "555.666.777-88",
      vehicleId: "3",
      vehicleBrand: "Volkswagen",
      vehicleModel: "Jetta",
      vehicleYear: 2023,
      salePrice: 152000,
      date: "2024-12-05T15:45:00Z",
      paymentMethod: "cash",
      tradeInVehicle: {
        brand: "Nissan",
        model: "Versa",
        year: 2019,
        fipePrice: 62000,
        entryValue: 52700,
      },
    },
    {
      id: "6",
      clientId: "client-6",
      clientName: "Fernanda Rodrigues",
      clientCpf: "999.888.777-66",
      vehicleId: "2",
      vehicleBrand: "Honda",
      vehicleModel: "Civic",
      vehicleYear: 2022,
      salePrice: 138000,
      date: "2024-12-08T10:30:00Z",
      paymentMethod: "financing",
    },
    {
      id: "7",
      clientId: "client-7",
      clientName: "Ricardo Almeida",
      clientCpf: "222.333.444-55",
      vehicleId: "1",
      vehicleBrand: "Toyota",
      vehicleModel: "Corolla",
      vehicleYear: 2023,
      salePrice: 145000,
      date: "2024-12-12T14:00:00Z",
      paymentMethod: "trade-in",
      tradeInVehicle: {
        brand: "Volkswagen",
        model: "Polo",
        year: 2017,
        fipePrice: 48000,
        entryValue: 40800,
      },
    },
    {
      id: "8",
      clientId: "client-8",
      clientName: "Juliana Martins",
      clientCpf: "333.444.555-66",
      vehicleId: "5",
      vehicleBrand: "Hyundai",
      vehicleModel: "HB20",
      vehicleYear: 2023,
      salePrice: 78000,
      date: "2024-12-15T09:00:00Z",
      paymentMethod: "cash",
    },
    // Outubro 2024
    {
      id: "9",
      clientId: "client-9",
      clientName: "Roberto Santos",
      clientCpf: "444.555.666-77",
      vehicleId: "4",
      vehicleBrand: "Chevrolet",
      vehicleModel: "Onix",
      vehicleYear: 2024,
      salePrice: 89000,
      date: "2024-10-10T13:20:00Z",
      paymentMethod: "financing",
      tradeInVehicle: {
        brand: "Renault",
        model: "Sandero",
        year: 2016,
        fipePrice: 38000,
        entryValue: 32300,
      },
    },
    {
      id: "10",
      clientId: "client-10",
      clientName: "Lucia Ferreira",
      clientCpf: "666.777.888-99",
      vehicleId: "3",
      vehicleBrand: "Volkswagen",
      vehicleModel: "Jetta",
      vehicleYear: 2023,
      salePrice: 152000,
      date: "2024-10-22T16:00:00Z",
      paymentMethod: "cash",
    },
    // Setembro 2024
    {
      id: "11",
      clientId: "client-11",
      clientName: "Marcos Vieira",
      clientCpf: "777.888.999-00",
      vehicleId: "1",
      vehicleBrand: "Toyota",
      vehicleModel: "Corolla",
      vehicleYear: 2023,
      salePrice: 145000,
      date: "2024-09-08T11:30:00Z",
      paymentMethod: "financing",
    },
    {
      id: "12",
      clientId: "client-12",
      clientName: "Beatriz Souza",
      clientCpf: "888.999.000-11",
      vehicleId: "5",
      vehicleBrand: "Hyundai",
      vehicleModel: "HB20",
      vehicleYear: 2023,
      salePrice: 78000,
      date: "2024-09-18T14:45:00Z",
      paymentMethod: "trade-in",
      tradeInVehicle: {
        brand: "Fiat",
        model: "Uno",
        year: 2014,
        fipePrice: 28000,
        entryValue: 23800,
      },
    },
    // Agosto 2024
    {
      id: "13",
      clientId: "client-13",
      clientName: "Gabriel Costa",
      clientCpf: "123.321.456-78",
      vehicleId: "2",
      vehicleBrand: "Honda",
      vehicleModel: "Civic",
      vehicleYear: 2022,
      salePrice: 138000,
      date: "2024-08-15T10:15:00Z",
      paymentMethod: "cash",
    },
    // Julho 2024
    {
      id: "14",
      clientId: "client-14",
      clientName: "Patricia Lima",
      clientCpf: "654.987.321-00",
      vehicleId: "4",
      vehicleBrand: "Chevrolet",
      vehicleModel: "Onix",
      vehicleYear: 2024,
      salePrice: 89000,
      date: "2024-07-25T13:00:00Z",
      paymentMethod: "financing",
      tradeInVehicle: {
        brand: "Chevrolet",
        model: "Prisma",
        year: 2015,
        fipePrice: 42000,
        entryValue: 35700,
      },
    },
  ]);

  const handleAddVehicle = (vehicle: Omit<Vehicle, "id">) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `vehicle-${Date.now()}`,
    };
    setVehicles([...vehicles, newVehicle]);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const handleAddTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `transaction-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setTransactions([...transactions, newTransaction]);
    
    // Atualizar status do veículo para vendido
    setVehicles(vehicles.map(v => 
      v.id === transaction.vehicleId 
        ? { ...v, status: "sold" as const }
        : v
    ));
  };

  // Calcular estatísticas para o dashboard
  const totalVehicles = vehicles.filter(v => v.status === "available").length;
  const totalTransactions = transactions.length;
  const uniqueClients = new Set(transactions.map(t => t.clientId)).size;
  
  // Receita do último mês
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const monthlyRevenue = transactions
    .filter(t => new Date(t.date) >= oneMonthAgo)
    .reduce((sum, t) => sum + t.salePrice, 0);

  const navigation = [
    { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory" as Page, label: "Estoque", icon: Car },
    { id: "transactions" as Page, label: "Transações", icon: Receipt },
    { id: "reports" as Page, label: "Relatórios", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          <div className="border-b p-6">
            <h2 className="font-bold">Garage011</h2>
            <p className="text-sm text-muted-foreground">Sistema de Gestão</p>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentPage(item.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground text-center">
              © 2025 Garage011
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {currentPage === "dashboard" && (
          <Dashboard
            totalVehicles={totalVehicles}
            totalTransactions={totalTransactions}
            totalClients={uniqueClients}
            monthlyRevenue={monthlyRevenue}
            transactions={transactions}
          />
        )}
        {currentPage === "inventory" && (
          <Inventory
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        )}
        {currentPage === "transactions" && (
          <Transactions
            vehicles={vehicles}
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
          />
        )}
        {currentPage === "reports" && (
          <Reports transactions={transactions} />
        )}
      </main>
    </div>
  );
}

export default App;