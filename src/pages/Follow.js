
import React from 'react';
import { Button } from 'react-bootstrap';
import { followUser, unfollowUser } from '../api'; // Import your API functions

const FollowButton = ({ 
    profile, 
    isFollowing, 
    setIsFollowing, 
    setError,
    setProfile, // Add this prop to update the profile data
    setNotification 
}) => {
    const handleFollow = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await followUser(profile.username, token);
        setIsFollowing(true);
        // Update the profile with new follower count
        setProfile(prev => ({
          ...prev,
          followersCount: prev.followersCount + 1
        }));
        setNotification({
            message: `Following ${profile.username}`,
            type: 'success'
          });      
        } catch (err) {
        console.error("Follow failed!", err);
        setError("Fail to follow!");
      }
    };
  
    const handleUnfollow = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await unfollowUser(profile.username, token);
        setIsFollowing(false);
        // Update the profile with new follower count
        setProfile(prev => ({
          ...prev,
          followersCount: prev.followersCount - 1
        }));
        setNotification({
            message: `Unfollow ${profile.username}`,
            type: 'error'
          });      
        } catch (err) {
        console.error("Unfollow failed!", err);
        setError("Fail to unfollow!");
      }
    };
  
    return (
      <div className="mt-3">
        {isFollowing ? (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleUnfollow}
          >
            Unfollow
          </Button>
        ) : (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleFollow}
          >
            Follow
          </Button>
        )}
      </div>
    );
  };
  
  export default FollowButton;