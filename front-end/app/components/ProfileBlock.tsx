import { useEffect, useMemo, useState } from "react";
import { useAuth, useRequireAuth } from "../hooks/useAuth";

export default function ProfileBlock() {
  const { user} = useAuth();
  const [profile] = useState<Record<string, any> | null>(null);
  
  
  const activeUser = profile ?? user;
  
  const fullName =
      activeUser?.userInfos?.firstName && activeUser?.userInfos?.lastName
        ? `${activeUser.userInfos.firstName} ${activeUser.userInfos.lastName}`
        : activeUser?.username ?? "Utilisateur";
  

    const joinedDate = activeUser?.userInfos?.createdAt ?? "2023-06-14";

  return (
<div className="profile-block">
            <div className="profile-avatar">
              {activeUser?.userInfos?.profilePicture ? (
                <img src={activeUser.userInfos.profilePicture} alt={fullName} />
              ) : (
                <span>{fullName.charAt(0)}</span>
              )}
            </div>

            <div className="profile-text">
              <h2>{fullName}</h2>
              <p>Membre depuis le 14 juin 2023</p>
            </div>
          </div>
  )
}