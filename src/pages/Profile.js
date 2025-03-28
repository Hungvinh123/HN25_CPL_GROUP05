import React, { useState, useEffect } from "react";
import { getCurrentUser, updateUser } from "../api";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const response = await getCurrentUser(token);
        setUser(response.data.user);
        setUsername(response.data.user.username || "");
        setBio(response.data.user.bio || "");
        setImage(response.data.user.image || "");
        setIsLoggedIn(true);
      } catch (err) {
        setError("Không thể tải thông tin người dùng");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedUser = { username, bio, image };
      const response = await updateUser(token, updatedUser);
      setUser(response.data.user);
      setError(null);
    } catch (err) {
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
console.log(user);
  return (
    <Container className="bg-white mt-5 mb-5 rounded shadow p-4">
      <Row>
        {/* Cột Avatar */}
        <Col md={3} className="border-end text-center">
          <div className="p-3 py-5">
            <img
              src={user?.image || "https://via.placeholder.com/150"}
              alt="avatar"
              className="rounded-circle mt-3 shadow"
              width="150px"
              height="150px"
              style={{ objectFit: "cover" }}
            />
            <h5 className="mt-3">{user?.username}</h5>
            <p className="text-muted">{user?.email}</p>
            <Button variant="danger" className="mt-2" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </Col>

        {/* Cột Form Cập Nhật */}
        <Col md={5} className="border-end">
          <div className="p-3 py-5">
            <h4 className="mb-4">Cài đặt hồ sơ</h4>
            {error && <p className="text-danger">{error}</p>}

            <Form onSubmit={handleUpdate}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label className="fw-bold">Tên</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên mới"
                  />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-bold">Giới thiệu</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Nhập giới thiệu"
                  />
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Ảnh đại diện (URL)</Form.Label>
                <Form.Control
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Dán đường dẫn ảnh"
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Lưu thay đổi
              </Button>
            </Form>
          </div>
        </Col>

        {/* Cột Kinh Nghiệm */}
        <Col md={4}>
          <div className="p-3 py-5">
            <h4 className="mb-3">Kinh nghiệm</h4>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Lĩnh vực</Form.Label>
              <Form.Control type="text" placeholder="Nhập lĩnh vực chuyên môn" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Chi tiết khác</Form.Label>
              <Form.Control type="text" placeholder="Thêm chi tiết bổ sung" />
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
