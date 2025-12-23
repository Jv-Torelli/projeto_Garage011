import { Search, Filter, Download, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState } from "react";
import type { Transaction } from "./transactions";

interface ReportsProps {
  transactions: Transaction[];
}

export function Reports({ transactions }: ReportsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.clientCpf.includes(searchTerm);

    const transactionDate = new Date(transaction.date);
    const matchesStartDate = !startDate || transactionDate >= new Date(startDate);
    const matchesEndDate = !endDate || transactionDate <= new Date(endDate);

    const matchesMinValue = !minValue || transaction.salePrice >= parseFloat(minValue);
    const matchesMaxValue = !maxValue || transaction.salePrice <= parseFloat(maxValue);

    return matchesSearch && matchesStartDate && matchesEndDate && matchesMinValue && matchesMaxValue;
  });

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.salePrice, 0);
  const totalEntryValue = filteredTransactions.reduce((sum, t) => 
    sum + (t.tradeInVehicle?.entryValue || 0), 0
  );

  const handleExport = () => {
    // Simular exportação de relatório
    const csvContent = [
      ["Data", "Cliente", "CPF", "Veículo", "Valor da Venda", "Entrada (Troca)", "Forma de Pagamento"],
      ...filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString('pt-BR'),
        t.clientName,
        t.clientCpf,
        `${t.vehicleBrand} ${t.vehicleModel} ${t.vehicleYear}`,
        t.salePrice.toString(),
        t.tradeInVehicle?.entryValue?.toString() || "0",
        t.paymentMethod,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-vendas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Relatório de Vendas</h1>
          <p className="text-muted-foreground">
            Consulte e filtre todas as transações realizadas
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vendas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Transações no período filtrado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todas as vendas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total em Entradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(totalEntryValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Avaliações FIPE aceitas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search">
                <Search className="inline h-4 w-4 mr-1" />
                Buscar por Nome/CPF
              </Label>
              <Input
                id="search"
                placeholder="Digite nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minValue">Valor Mínimo (R$)</Label>
              <Input
                id="minValue"
                type="number"
                placeholder="0,00"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxValue">Valor Máximo (R$)</Label>
              <Input
                id="maxValue"
                type="number"
                placeholder="0,00"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setStartDate("");
              setEndDate("");
              setMinValue("");
              setMaxValue("");
            }}
          >
            Limpar Filtros
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transações Encontradas ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Valor da Venda</TableHead>
                  <TableHead>Entrada (Troca)</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Nenhuma transação encontrada com os filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{transaction.clientName}</TableCell>
                      <TableCell>{transaction.clientCpf}</TableCell>
                      <TableCell>
                        {transaction.vehicleBrand} {transaction.vehicleModel} {transaction.vehicleYear}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(transaction.salePrice)}
                      </TableCell>
                      <TableCell>
                        {transaction.tradeInVehicle ? (
                          <div>
                            <p>
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(transaction.tradeInVehicle.entryValue)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {transaction.tradeInVehicle.brand} {transaction.tradeInVehicle.model}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.paymentMethod === "cash" && "À Vista"}
                        {transaction.paymentMethod === "financing" && "Financiamento"}
                        {transaction.paymentMethod === "trade-in" && "Troca com Torna"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
