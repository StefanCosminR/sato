import { Component, OnInit } from '@angular/core';
import {SPARQLEndpointService} from '../../../services/sparqlendpoint.service';

@Component({
  selector: 'sato-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {

  constructor(private sparqlEndpointService: SPARQLEndpointService) { }

  ngOnInit() {
      this.sparqlEndpointService.getAllTopics()
          .subscribe((result) => {
              console.log('got it', result);
          }, console.error);
  }

}
