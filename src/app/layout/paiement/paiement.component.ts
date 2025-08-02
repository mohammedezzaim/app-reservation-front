import { Component, OnInit } from '@angular/core';
import { loadScript } from '@paypal/paypal-js';
import {FactureService} from "../../sahred/service/communService/facture.service";
import {ReservationInformationComponent} from "../reservation-information/reservation-information.component";
import {FacteurApparetementComponent} from "../facteur-apparetement/facteur-apparetement.component";

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css']
})
export class PaiementComponent implements OnInit {
  public total=0;


  ngOnInit(): void {
    this.total=600;
    // Load the PayPal SDK
    // @ts-ignore
    loadScript({"client-id": "Aa-SflJqXqi9ZQDNq9fEkcLgRk3aT2_4Ap_nwIx0seEfxnLMzShSO5cdM0ZPSWoHYMgVw8vsK23acZXB"}).then((paypal) => {
      if (!paypal) {
        console.error("Failed to load the PayPal JS SDK script");
        return;
      }
      const totalAmount = this.total;
      // @ts-ignore
      paypal.Buttons({


        createOrder: function (data: any, actions: any) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value:totalAmount.toString()
              }
            }]
          });
        },
        onApprove: function (data: any, actions: any) {
          return actions.order.capture().then(function (details: any) {
            alert('Transaction completed by ' + details.payer.name.given_name);
          });
        }
      }).render('#paypal-button-container');
    }).catch((error) => {
      console.error("Failed to load PayPal SDK", error);
    });
  }

}
