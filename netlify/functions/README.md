# Netlify Functions

## Twitter Verification Function

The `verify-twitter.js` function verifies Twitter usernames and attempts to verify if users are following the target account.

### Setup

1. Get a Twitter API Bearer Token from [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Add `TWITTER_BEARER_TOKEN` to your Netlify environment variables
3. The function will automatically be deployed when you deploy to Netlify

### How It Works

1. **Username Verification**: Verifies that the submitted Twitter username exists (works with Bearer Token)
2. **Follower Verification**: Attempts to verify if the user follows the target account

### Important Note on Follower Verification

Twitter API v2's following relationship endpoint (`GET /2/users/:id/following`) requires **OAuth 2.0 user context**, not just a Bearer Token. This means:

- ✅ **Username verification works** - We can verify if a username exists
- ⚠️ **Follower verification may require OAuth** - Full verification requires the user to authenticate with Twitter

### Current Behavior

- If Bearer Token has sufficient permissions, follower verification will work
- If not, the function will verify the username exists but return `requiresOAuth: true`
- The form will still validate the username is real

### Future Enhancement: OAuth Implementation

To enable full follower verification without limitations, you would need to:

1. Implement Twitter OAuth 2.0 flow
2. Have users authenticate with Twitter
3. Use their OAuth token to check following status

This is more complex but provides complete verification.

### Testing

You can test the function locally using Netlify CLI:

```bash
netlify dev
```

Then make a POST request to `/.netlify/functions/verify-twitter` with:

```json
{
  "username": "testuser",
  "targetAccount": "kinetrax"
}
```
