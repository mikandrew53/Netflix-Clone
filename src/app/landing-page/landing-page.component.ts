import { Component, OnInit } from '@angular/core';
import { faGlobe, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface faqQuestion {
  question: string,
  answer: Array<string>,
  active: boolean
}
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  constructor() { }
  faGlobe = faGlobe
  faChevronRight = faChevronRight;

  faq: Array<faqQuestion>
  ngOnInit(): void {
    this.faq = [
      {
        question: 'What is Netflix?',
        answer: [
          `Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.`,
          `You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price. There's always something new to discover and new TV shows and movies are added every week!`,
        ],
        active: false
      },
      {
        question: 'How much does Netflix cost?',
        answer: [
          'Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $9.99 to $18.99 a month. No extra costs, no contracts.',
        ],
        active: false
      },
      {
        question: 'Where can I watch?',
        answer: [
          `Watch anywhere, anytime, on an unlimited number of devices. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.`,
          `You can also download your favorite shows with the iOS, Android, or Windows 10 app. Use downloads to watch while you're on the go and without an internet connection. Take Netflix with you anywhere.`,
        ], 
        active: false
      },
      {
        question: 'How do I cancel?',
        answer: [
          `Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.`,
        ],
        active: false
      },
      {
        question: 'What can I wacth on Netflix?',
        answer: [
          `Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.`,
        ],
        active: false
      },
    ]
  }

  onAccordianClick(index:number){
    console.log('yo');
    
    let accordian = document.getElementById(`accordian-${{index}}`);
    let pannel = document.getElementById('panel-'+index);
    if(this.faq[index].active)
      pannel.style.maxHeight = null;
    else {
      pannel.style.maxHeight = pannel.scrollHeight + 'px';
      this.faq.forEach((question, i) => {
        if(question.active){
          let pannelToClose = document.getElementById('panel-'+i);
          pannelToClose.style.maxHeight = null;
          question.active = false;
        }
      })
    }
    
      this.faq[index].active = !this.faq[index].active;
  }

}
 