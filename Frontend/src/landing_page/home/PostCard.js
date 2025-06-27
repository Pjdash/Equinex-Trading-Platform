import React, { useState } from 'react';

function PostCard({ post, handleDelete }) {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    const cardStyle = {
        backgroundColor: 'black',
        border: '1px solid #333',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        color: '#ddd',
        maxWidth: '600px',
        margin: '0 auto',
    };

    const profileImgStyle = {
        width: '50px',
        height: '50px',
        objectFit: 'cover',
    };

    const usernameStyle = {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '16px',
    };

    const postContentStyle = {
        color: '#f0f0f0',
        fontSize: '16px',
        backgroundColor: '#2a2a2a',
        padding: '12px',
        borderRadius: '5px',
        lineHeight: '1.5',
        marginTop: '10px',
    };

    const imageContainerStyle = {
        marginTop: '15px',
        textAlign: 'center',
    };

    const postImageStyle = {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
        objectFit: 'cover',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };

    const btnDeleteStyle = {
        backgroundColor: '#dc3545',
        color: 'white',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 20px',
        marginTop: '15px',
        width: '100%',
        transition: 'background-color 0.3s ease',
        cursor: 'pointer',
    };

    const btnDeleteHoverStyle = {
        backgroundColor: '#c82333',
    };

    const handleLike = () => {
        setLiked(!liked);
        if (!liked) setDisliked(false); // Unset dislike if liked
    };

    const handleDislike = () => {
        setDisliked(!disliked);
        if (!disliked) setLiked(false); // Unset like if disliked
    };

    return (
        <div className="card p-3 mb-4" style={cardStyle}>
            <div className="d-flex align-items-center mb-3">
                <img
                    src="https://via.placeholder.com/50"
                    alt="Profile"
                    className="rounded-circle me-3"
                    style={profileImgStyle}
                />
                <span className="fw-bold" style={usernameStyle}>
                    {post.username}
                </span>
            </div>
            <p className="mb-2" style={postContentStyle}>
                {post.content}
            </p>
            {post.doc && (
                <div className="image-container" style={imageContainerStyle}>
                    <img
                        src={post.doc.url}
                        alt={post.doc.filename}
                        className="post-image img-fluid mb-2"
                        style={postImageStyle}
                    />
                </div>
            )}
            <div className="d-flex justify-content-between mb-3">
                <button
                    onClick={handleLike}
                    className={`btn ${liked ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                    <i className={`fa${liked ? 's' : 'r'} fa-thumbs-up`}></i> {liked ? 'Liked' : 'Like'}
                </button>
                <button
                    onClick={handleDislike}
                    className={`btn ${disliked ? 'btn-danger' : 'btn-outline-danger'}`}
                >
                    <i className={`fa${disliked ? 's' : 'r'} fa-thumbs-down`}></i> {disliked ? 'Disliked' : 'Dislike'}
                </button>
            </div>
            <button
                className="btn btn-delete mt-4"
                onClick={() => handleDelete(post._id, post.username)}
                style={btnDeleteStyle}
                onMouseOver={(e) => e.target.style.backgroundColor = btnDeleteHoverStyle.backgroundColor}
                onMouseOut={(e) => e.target.style.backgroundColor = btnDeleteStyle.backgroundColor}
            >
                Delete Post
            </button>
        </div>
    );
}

export default PostCard;
