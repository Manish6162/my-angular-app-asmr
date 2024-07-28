import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environment } from './app/environment';

@Component({
  selector: 'app-feeds-list',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css'],
})
export class FeedsComponent implements OnInit {
  orderedFeeds: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.retrieveFileUrls();
  }

  retrieveFileUrls(): void {
    const apiUrl = `https://localhost:7290/api/Feeds/all`;

    this.http.get<any>(apiUrl).subscribe(
      (response: any) => {
        this.orderedFeeds = response.orderedFeeds;
      },
      (error) => {
        console.error('An error occurred while retrieving feeds:', error);
      }
    );
  }

  downloadFile(url: string): void {
    window.open(url, '_blank');
  }

  reportFeed(feedId: string): void {
    console.log(`Report feed: ${feedId}`);
  }

  likeFeed(feedId: string, index: number): void {
    const likeApiUrl = `https://localhost:7290/api/Feeds/${feedId}/like`;

    this.http.put(likeApiUrl, {}).subscribe(
      (response: any) => {
        console.log('Feed liked successfully');
        this.orderedFeeds[index].liked = !this.orderedFeeds[index].liked;
        this.orderedFeeds[index].liked ? this.orderedFeeds[index].likes++ : this.orderedFeeds[index].likes--;
      },
      (error) => {
        console.error('An error occurred while liking the feed:', error);
      }
    );
  }
}
