import React, { useState, useEffect } from "react";
import { getCurrentUser, updateUser } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./Profile.css"; // Import custom CSS
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../pages/Header";
import { getProfile } from "../api"; // new import
import FollowButton from "./Follow"; // new import
import Notification from './Notification'; // new import
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [notification, setNotification] = useState(null); // new import
  const [profile, setProfile] = useState(null); //new import
  const [isFollowing, setIsFollowing] = useState(false); //new import
  const [isOwnProfile, setIsOwnProfile] = useState(true); //new import
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(false);

  const navigate = useNavigate();
  const { username: profileUsername } = useParams(); //new import

  //new import
  useEffect(() => {
    const fetchUserArticles = async () => {
      setArticlesLoading(true);
      try {
        const usernameToFetch = isOwnProfile ? user?.username : profile?.username;
        if (!usernameToFetch) return;

        const response = await axios.get(
          `https://node-express-conduit.appspot.com/api/articles?author=${usernameToFetch}&order=desc`
        );
        
        const sortedArticles = response.data.articles.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setArticles(sortedArticles);
      } catch (err) {
        setError("Không thể tải bài viết");
      } finally {
        setArticlesLoading(false);
      }
    };

    fetchUserArticles();
  }, [isOwnProfile, user?.username, profile?.username]);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        if (!profileUsername) {
        const response = await getCurrentUser(token);
        const data = response.data.user;
        setUser(data);
        setUsername(data.username || "");
        setBio(data.bio || "");
        setImage(data.image || "https://i.pinimg.com/236x/e6/60/85/e66085932a4b3b411854aff54574ecd6.jpg");
        setIsLoggedIn(true);
      } else {
        // Viewing another user's profile
        const currentUserResponse = await getCurrentUser(token);
        setUser(currentUserResponse.data.user);
        
        const profileResponse = await getProfile(profileUsername, token);
        setProfile(profileResponse.data.profile);
        setIsFollowing(profileResponse.data.profile.following);
        setIsOwnProfile(false);
        setIsLoggedIn(true);
      }
      } catch (err) {
        setError("Không thể tải thông tin người dùng");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      }
    };
    fetchUser();
  }, []);

  // Chỉ cập nhật 3 trường: username, bio, image
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedUser = { username, bio, image };
  
      const response = await updateUser(token, updatedUser);
      if (response.status === 200) {
        setUser(response.data.user);
        toast.success("Cập nhật thành công! 🎉");
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("Update failed!", err);
      toast.error("Cập nhật thất bại!");
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  if (!isLoggedIn) {
    return (
      <Container className="mt-5 text-center">
        <h3 className="text-white">Bạn chưa đăng nhập.</h3>
        <Button variant="primary" onClick={() => navigate("/login")}>
          Đăng nhập ngay
        </Button>
      </Container>
    );
  }

  
 

  return (
    <>
    <Header />
    <Container fluid className="profile-page py-5 mt-5">
    {notification && (
        <Notification 
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(null)}
        />
      )}
      <Row className="justify-content-center">
        {/* Left Column: Profile Card */}
        <Col md={3} className="mb-4">
          <Card className="profile-card">
            <Card.Body className="text-center">
            <div className="profile-image-wrapper">
    <img
      src={
        (isOwnProfile ? user?.image : profile?.image) ||
        "https://i.pinimg.com/236x/e6/60/85/e66085932a4b3b411854aff54574ecd6.jpg"
      }
      alt="User Avatar"
      className="profile-image"
    />
  </div>
  <h5 className="profile-name mt-3">
    {isOwnProfile ? user?.username : profile?.username || "No Username"}
  </h5>
              
              {!isOwnProfile && (    // new import
                <FollowButton 
                  profile={profile}
                  isFollowing={isFollowing}
                  setIsFollowing={setIsFollowing}
                  setError={setError}
                  setProfile={setProfile}
                  setNotification={setNotification}
                />
              )} {isOwnProfile && (
              <>
              <Button variant="outline-secondary" size="sm" className="mt-2">
                Upload New Photo
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                className="mt-2 d-block"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
              </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Edit Profile Form */}
        <Col md={8}>
          <Card className="edit-profile-card">
            <Card.Body>
            {isOwnProfile ? (
                <>
              <h3 className="mb-4">Edit Profile</h3>
              <Form onSubmit={handleUpdate}>
                {error && <p className="text-danger">{error}</p>}
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Nhập giới thiệu"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Image (URL)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Dán đường dẫn ảnh"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </Form.Group>
                <Button variant="danger" type="submit" className="mt-3">
                  Update Info
                </Button>
              </Form>
              </>
              ) : ( //new import
                <>
                  <h3 className="mb-4">Profile Information</h3>
                  {error && <p className="text-danger">{error}</p>}
                  <div className="mb-3">
                    <h5>Username</h5>
                    <p>{profile.username}</p>
                  </div>
                  <div className="mb-3">
                    <h5>Bio</h5>
                    <p>{profile.bio || "No bio yet"}</p>
                  </div>
                </>
              )}  
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4 justify-content-center">
          <Col md={11}>
            <Card className="articles-card">
              <Card.Body>
                <h4 className="mb-4">Bài viết gần đây</h4>
                {articlesLoading ? (
                  <div className="text-center">Đang tải bài viết...</div>
                ) : articles.length > 0 ? (
                  articles.map(article => (
                    <div key={article.slug} className="mb-4 article-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5>
                            <a 
                              href={`/article/${article.slug}`}
                              className="text-dark text-decoration-none"
                            >
                              {article.title}
                            </a>
                          </h5>
                          <p className="text-muted">
                            {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p>{article.description}</p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-success">
                            ♡ {article.favoritesCount}
                          </span>
                        </div>
                      </div>
                      {article.tagList?.length > 0 && (
                        <div className="tags-container mt-2">
                          {article.tagList.map(tag => (
                            <span key={tag} className="tag">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center">Không có bài viết nào</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <ToastContainer position="top-center" autoClose={3000} />
    </Container>
    </>
  );
};

export default Profile;