import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-contract-management',
  templateUrl: './contract-management.component.html',
  styleUrls: ['./contract-management.component.scss']
})
export class ContractManagementComponent implements OnInit {
  mockContracts = [
    { id: 1, contractName: "Auth Response Schema", contractType: "Consumer Contract" },
    { id: 2, contractName: "User Profile Definition", contractType: "Provider Contract" },
    { id: 3, contractName: "Payment Gateway API", contractType: "Consumer Contract" }
  ];

  isFormVisible = false;
  selectedContract: any = null;
  formMode: 'new' | 'edit' | 'view' = 'new';

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.setHeaderData(
      'Contract Management',
      'Manage and configure your test case contracts with high-fidelity validation rules.'
    );
  }

  get totalPages(): number {
    return Math.ceil(this.mockContracts.length / this.itemsPerPage);
  }

  get paginatedContracts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.mockContracts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  toggleForm(mode: 'new' | 'edit' | 'view', data: any = null) {
    this.formMode = mode;
    this.selectedContract = data ? { ...data } : null;
    this.isFormVisible = true;
  }

  handleSaveSuccess(updatedData: any) {
    if (this.formMode === 'edit') {
      const index = this.mockContracts.findIndex(c => c.id === updatedData.id);
      if (index !== -1) {
        this.mockContracts[index] = { ...this.mockContracts[index], ...updatedData };
      }
    } else {
      const newId = this.mockContracts.length > 0 ? Math.max(...this.mockContracts.map(c => c.id)) + 1 : 1;
      this.mockContracts.push({
        id: newId,
        contractName: updatedData.contractName,
        contractType: updatedData.contractType
      });
    }
    this.isFormVisible = false;
    this.selectedContract = null;
  }

  handleCancel() {
    this.isFormVisible = false;
    this.selectedContract = null;
  }

  saveAllContracts() {
    console.log('Final contract list saved:', this.mockContracts);
    alert('All changes to the contract list have been saved successfully.');
  }

  deleteContract(id: number) {
    if (confirm('Are you sure you want to delete this contract?')) {
      this.mockContracts = this.mockContracts.filter(c => c.id !== id);
      if (this.currentPage > this.totalPages && this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }

  onBack() {
    window.history.back();
  }
}
