import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { fetchDataForAllYears } from "./GetContributions";
import { usernameSchema } from "./UsernameValidator";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateGitHubWorth(
  contributions: number,
  followers: number,
  stars: number
) {
  // You can adjust the weights as per your preference
  const contributionWeight = 0.5;
  const followerWeight = 0.1;
  const starWeight = 0.3;

  // Calculate the estimated worth using the formula
  const estimatedWorth =
    contributions * contributionWeight +
    followers * followerWeight +
    stars * starWeight;

  return estimatedWorth.toFixed(1);
}
