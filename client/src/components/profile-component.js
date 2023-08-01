import { useState, useEffect, useContext, createContext } from "react";
import AuthService from "../services/auth-service";
import CurrentUserContext from "../CurrentUser-context";

const ProfileComponent = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());
  }, []); //這段程式碼意思是當我們第一次渲染profile頁面時，執行setCurrentUser，將localStorage儲存的使用者資訊儲存到CurrentUser變數內，也就是說如果CurrentUser不存在的話就代表使用者未登錄(localStorage內沒有資料)，則不能看到profile的內容

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && <div>在獲取您的個人資料之前，您必須先登錄。</div>}
      {currentUser && (
        <div>
          <h2>以下是您的個人檔案：</h2>

          <table className="table">
            <tbody>
              <tr>
                <td>
                  <strong>姓名：{currentUser.user.username}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>您的用戶ID: {currentUser.user._id}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>您註冊的電子信箱: {currentUser.user.email}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>身份: {currentUser.user.role}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
