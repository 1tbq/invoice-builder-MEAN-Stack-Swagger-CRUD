import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { InvoiceService } from "../../services/invoice.service";
import { MatSnackBar } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { Invoice } from "../../models/invoice";

@Component({
  selector: "app-invoice-form",
  templateUrl: "./invoice-form.component.html",
  styleUrls: ["./invoice-form.component.css"]
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  invoice: Invoice;
  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.createForm();
    this.setInvoiceToForm();
  }

  private createForm() {
    this.invoiceForm = this.fb.group({
      item: ["", Validators.required],
      date: ["", Validators.required],
      due: ["", Validators.required],
      qty: ["", Validators.required],
      rate: "",
      tax: ""
    });
  }
  private setInvoiceToForm() {
    this.route.params.subscribe(params => {
      let id = params["id"];
      if (!id) return;
      this.invoiceService.getInvoice(id).subscribe(invoice => {
        this.invoice = invoice;
        this.invoiceForm.patchValue(this.invoice);
      });
    });
  }

  onSubmit() {
    if (this.invoice) {
      this.invoiceService
        .updateInvoice(this.invoice._id, this.invoiceForm.value)
        .subscribe(data => {
          this.snackBar.open("Invoice Updated", "Sucess", {
            duration: 2350
          });
          this.router.navigate(["dashboard", "invoices"]);
        });
    } else {
      this.invoiceService.createInvoice(this.invoiceForm.value).subscribe(
        data => {
          this.snackBar.open("Invoice Created", "Success", {
            duration: 2000
          });
          this.invoiceForm.reset();
          this.router.navigate(["dashboard", "invoices"]);
        },
        err => {
          this.errorHandler(err, "Failed to create an Invoice");
        }
      );
    }
  }

  private errorHandler(error, message) {
    console.error(error);
    this.snackBar.open(message, "Error", {
      duration: 2000
    });
  }
}
