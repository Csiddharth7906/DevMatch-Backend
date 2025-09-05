const axios = require('axios');

/**
 * GitHub API integration utility for fetching user repositories
 */
class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DevMatch-Backend'
    };
    
    // Add GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      this.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
  }

  /**
   * Extract GitHub username from GitHub URL
   * @param {string} githubUrl - Full GitHub profile URL
   * @returns {string|null} - GitHub username or null if invalid
   */
  extractUsername(githubUrl) {
    if (!githubUrl) return null;
    
    const patterns = [
      /github\.com\/([^\/\?#]+)/i,
      /^([a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})$/
    ];
    
    for (const pattern of patterns) {
      const match = githubUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  }

  /**
   * Fetch user's public repositories from GitHub
   * @param {string} username - GitHub username
   * @param {number} limit - Maximum number of repos to fetch (default: 10)
   * @returns {Promise<Array>} - Array of repository objects
   */
  async getUserRepositories(username, limit = 10) {
    try {
      if (!username) {
        throw new Error('GitHub username is required');
      }

      const response = await axios.get(
        `${this.baseURL}/users/${username}/repos`,
        {
          headers: this.headers,
          params: {
            sort: 'updated',
            direction: 'desc',
            per_page: limit,
            type: 'owner' // Only show repos owned by user, not forks
          },
          timeout: 10000 // 10 second timeout
        }
      );

      return response.data.map(repo => ({
        name: repo.name,
        description: repo.description || 'No description available',
        url: repo.html_url,
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        updatedAt: new Date(repo.updated_at),
        isPrivate: repo.private,
        topics: repo.topics || []
      }));

    } catch (error) {
      console.error('GitHub API Error:', error.message);
      
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          throw new Error('GitHub user not found');
        } else if (status === 403) {
          throw new Error('GitHub API rate limit exceeded');
        } else if (status === 401) {
          throw new Error('GitHub API authentication failed');
        }
      }
      
      throw new Error('Failed to fetch GitHub repositories');
    }
  }

  /**
   * Get GitHub user profile information
   * @param {string} username - GitHub username
   * @returns {Promise<Object>} - User profile data
   */
  async getUserProfile(username) {
    try {
      if (!username) {
        throw new Error('GitHub username is required');
      }

      const response = await axios.get(
        `${this.baseURL}/users/${username}`,
        {
          headers: this.headers,
          timeout: 10000
        }
      );

      const user = response.data;
      return {
        username: user.login,
        name: user.name,
        bio: user.bio,
        location: user.location,
        company: user.company,
        blog: user.blog,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        createdAt: new Date(user.created_at),
        avatarUrl: user.avatar_url
      };

    } catch (error) {
      console.error('GitHub Profile Error:', error.message);
      throw new Error('Failed to fetch GitHub profile');
    }
  }

  /**
   * Sync user's GitHub repositories and update database
   * @param {Object} user - User document from database
   * @returns {Promise<Array>} - Updated repositories array
   */
  async syncUserRepositories(user) {
    try {
      const username = this.extractUsername(user.github);
      if (!username) {
        throw new Error('Invalid GitHub URL');
      }

      const repos = await this.getUserRepositories(username, 15);
      
      // Update user's GitHub repos and sync timestamp
      user.githubRepos = repos;
      user.lastGithubSync = new Date();
      
      await user.save();
      
      return repos;
    } catch (error) {
      console.error('GitHub Sync Error:', error.message);
      throw error;
    }
  }

  /**
   * Check if GitHub data needs refresh (older than 1 hour)
   * @param {Date} lastSync - Last sync timestamp
   * @returns {boolean} - True if refresh needed
   */
  needsRefresh(lastSync) {
    if (!lastSync) return true;
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return lastSync < oneHourAgo;
  }
}

module.exports = new GitHubService();
