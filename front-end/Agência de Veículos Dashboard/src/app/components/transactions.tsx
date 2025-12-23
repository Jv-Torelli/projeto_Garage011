import { Plus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import type { Vehicle } from "./inventory";

export interface Client {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
}

export interface Transaction {
  id: string;
  clientId: string;
  clientName: string;
  clientCpf: string;
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  tradeInVehicle?: {
    brand: string;
    model: string;
    year: number;
    fipePrice: number;
    entryValue: number; // FIPE - 15%
  };
  salePrice: number;
  date: string;
  paymentMethod: string;
}

interface TransactionsProps {
  vehicles: Vehicle[];
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, "id" | "date">) => void;
}

export function Transactions({ vehicles, transactions, onAddTransaction }: TransactionsProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientCpf: "",
    clientPhone: "",
    clientEmail: "",
    vehicleId: "",
    paymentMethod: "financing",
    hasTradeIn: false,
    tradeInBrand: "",
    tradeInModel: "",
    tradeInYear: new Date().getFullYear(),
    tradeInFipePrice: 0,
  });

  const availableVehicles = vehicles.filter(v => v.status === "available");

  const calculateEntryValue = (fipePrice: number) => {
    return fipePrice * 0.85; // FIPE - 15%
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
    if (!selectedVehicle) return;

    const transaction: Omit<Transaction, "id" | "date"> = {
      clientId: `client-${Date.now()}`,
      clientName: formData.clientName,
      clientCpf: formData.clientCpf,
      vehicleId: formData.vehicleId,
      vehicleBrand: selectedVehicle.brand,
      vehicleModel: selectedVehicle.model,
      vehicleYear: selectedVehicle.year,
      salePrice: selectedVehicle.price,
      paymentMethod: formData.paymentMethod,
    };

    if (formData.hasTradeIn) {
      transaction.tradeInVehicle = {
        brand: formData.tradeInBrand,
        model: formData.tradeInModel,
        year: formData.tradeInYear,
        fipePrice: formData.tradeInFipePrice,
        entryValue: calculateEntryValue(formData.tradeInFipePrice),
      };
    }

    onAddTransaction(transaction);
    
    setFormData({
      clientName: "",
      clientCpf: "",
      clientPhone: "",
      clientEmail: "",
      vehicleId: "",
      paymentMethod: "financing",
      hasTradeIn: false,
      tradeInBrand: "",
      tradeInModel: "",
      tradeInYear: new Date().getFullYear(),
      tradeInFipePrice: 0,
    });
    setOpen(false);
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Transações</h1>
          <p className="text-muted-foreground">
            Registre vendas e avaliações FIPE
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nova Transação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Dados do Cliente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nome Completo</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientCpf">CPF</Label>
                    <Input
                      id="clientCpf"
                      value={formData.clientCpf}
                      onChange={(e) => setFormData({ ...formData, clientCpf: e.target.value })}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Telefone</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">E-mail</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Veículo Vendido</h3>
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Selecione o Veículo</Label>
                  <Select value={formData.vehicleId} onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} {vehicle.year} - {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(vehicle.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">À Vista</SelectItem>
                      <SelectItem value="financing">Financiamento</SelectItem>
                      <SelectItem value="trade-in">Troca com Torna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasTradeIn"
                    checked={formData.hasTradeIn}
                    onChange={(e) => setFormData({ ...formData, hasTradeIn: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="hasTradeIn" className="cursor-pointer">
                    Cliente possui veículo para entrada (Avaliação FIPE)
                  </Label>
                </div>

                {formData.hasTradeIn && (
                  <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-semibold">Veículo do Cliente (Entrada)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tradeInBrand">Marca</Label>
                        <Input
                          id="tradeInBrand"
                          value={formData.tradeInBrand}
                          onChange={(e) => setFormData({ ...formData, tradeInBrand: e.target.value })}
                          required={formData.hasTradeIn}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tradeInModel">Modelo</Label>
                        <Input
                          id="tradeInModel"
                          value={formData.tradeInModel}
                          onChange={(e) => setFormData({ ...formData, tradeInModel: e.target.value })}
                          required={formData.hasTradeIn}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tradeInYear">Ano</Label>
                        <Input
                          id="tradeInYear"
                          type="number"
                          value={formData.tradeInYear}
                          onChange={(e) => setFormData({ ...formData, tradeInYear: parseInt(e.target.value) })}
                          required={formData.hasTradeIn}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tradeInFipePrice">Valor FIPE (R$)</Label>
                        <Input
                          id="tradeInFipePrice"
                          type="number"
                          step="0.01"
                          value={formData.tradeInFipePrice}
                          onChange={(e) => setFormData({ ...formData, tradeInFipePrice: parseFloat(e.target.value) })}
                          required={formData.hasTradeIn}
                        />
                      </div>
                    </div>
                    {formData.tradeInFipePrice > 0 && (
                      <div className="bg-primary/10 border border-primary rounded-lg p-4">
                        <p className="text-sm font-medium">Valor calculado para entrada:</p>
                        <p className="text-2xl font-bold text-primary">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(calculateEntryValue(formData.tradeInFipePrice))}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          (Valor FIPE - 15%)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full">
                Registrar Transação
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.slice(-5).reverse().map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <p className="font-medium">{transaction.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.vehicleBrand} {transaction.vehicleModel} {transaction.vehicleYear}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(transaction.salePrice)}
                  </p>
                  {transaction.tradeInVehicle && (
                    <p className="text-xs text-muted-foreground">
                      Entrada: {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(transaction.tradeInVehicle.entryValue)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
