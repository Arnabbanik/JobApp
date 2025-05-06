import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Job } from '../model/job';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private apiUrl = 'http://localhost:8080/jobPosts';
  private createapiUrl = 'http://localhost:8080/jobPost';
  private updateapiUrl = 'http://localhost:8080/updateJobPost';


  constructor(private http: HttpClient) { }

  getAllJobData(): Observable<Job[]>{
    return this.http.get<Job[]>(this.apiUrl);
  }

  createJob(formData: FormData): Observable<Job> {
    return this.http.post<Job>(this.createapiUrl, formData);
  }

  updateJob(formData: FormData): Observable<Job>{
    return this.http.put<Job>(this.updateapiUrl, formData);
  }

  getJobById(postId: string): Observable<Job>{
    return this.http.get<Job>(`http://localhost:8080/jobPost/${postId}`);
  }

  getJobImage(postId: string): Observable<Blob> {
    return this.http.get(`http://localhost:8080/jobposts/${postId}/image`, {
      responseType: 'blob'  // Important: this tells Angular it's binary data
    });
  }

  deleteJob(postId: string): Observable<string> {
    return this.http.delete(`http://localhost:8080/jobPost/${postId}`, { responseType: 'text' });
  }
}
