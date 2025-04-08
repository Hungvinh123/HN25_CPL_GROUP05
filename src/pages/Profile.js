import React, { useState, useEffect } from "react";
import { getCurrentUser, updateUser } from "../api";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./Profile.css"; // Import custom CSS
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const navigate = useNavigate();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const response = await getCurrentUser(token);
        const data = response.data.user;
        setUser(data);
        setUsername(data.username || "");
        setBio(data.bio || "");
        setImage(data.image || "https://i.pinimg.com/236x/e6/60/85/e66085932a4b3b411854aff54574ecd6.jpg");
        setIsLoggedIn(true);
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
        setError(null);
      } else {
        setError("Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("Update failed!", err);
      setError("Cập nhật thất bại!");
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
    <Container fluid className="profile-page py-5">
      <Row className="justify-content-center">
        {/* Left Column: Profile Card */}
        <Col md={3} className="mb-4">
          <Card className="profile-card">
            <Card.Body className="text-center">
              <div className="profile-image-wrapper">
                <img
                  src={image || "https://via.placeholder.com/150"}
                  alt="User Avatar"
                  className="profile-image"
                />
              </div>
              <h5 className="profile-name mt-3">
                {username || "No Username"}
              </h5>
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
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Edit Profile Form */}
        <Col md={8}>
          <Card className="edit-profile-card">
            <Card.Body>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
