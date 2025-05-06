import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/model/job';
import { JobService } from 'src/app/services/job.service';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  jobs: Job[] = [];
  faTrash = faTrash;
  faEdit=faEdit;
  

  loadingImages: { [key: string]: boolean } = {};

  constructor(private jobService: JobService){}

  ngOnInit(){
    this.loadJobs();
  }

  loadJobs() {
    // Assuming you have a method to get jobs
    this.jobService.getAllJobData().subscribe(jobs => {
      this.jobs = jobs;
      // Load images for each job
      this.jobs.forEach(job => this.loadJobImage(job));
    });
  }

  loadJobImage(job: Job) {
    this.loadingImages[job.postId] = true;
    
    this.jobService.getJobImage(job.postId).subscribe({
      next: (blob) => {
        job.imageName = URL.createObjectURL(blob);
        this.loadingImages[job.postId] = false;
      },
      error: (err) => {
        console.error(`Error loading image for job ${job.postId}:`, err);
        this.loadingImages[job.postId] = false;
        // You could set a default image here if you want
        // job.imageUrl = 'assets/default-job-image.png';
      }
    });
  }

  ngOnDestroy() {
    // Clean up all object URLs to prevent memory leaks
    this.jobs.forEach(job => {
      if (job.imageName) {
        URL.revokeObjectURL(job.imageName);
      }
    });
  }

  deleteJob(postId: string): void {
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(postId).subscribe({
        next: (msg) => {
          alert('Job deleted successfully!');
          this.loadJobs(); // or reload the current list
        },
        error: (err) => {
          console.error('Failed to delete job:', err);
          alert('Failed to delete job. Please try again.');
        }
      });
    }
  }
}
