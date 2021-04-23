import { Component, OnInit } from '@angular/core';
import { faGlobe, faChevronRight } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  constructor() { }
  faGlobe = faGlobe
  faChevronRight = faChevronRight;
  ngOnInit(): void {
  }

}
