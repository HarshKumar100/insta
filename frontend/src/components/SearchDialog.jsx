import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchDialog = ({ open, setOpen }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:8080/api/v1/user/search?query=${query}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setSearchResults(res.data.users);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
        setOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Search Users</DialogTitle>
                </DialogHeader>
                <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="my-4"
                />
                <div className="max-h-[300px] overflow-y-auto">
                    {loading ? (
                        <div className="text-center">Searching...</div>
                    ) : (
                        searchResults.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                                onClick={() => handleUserClick(user._id)}
                            >
                                <Avatar>
                                    <AvatarImage src={user.profilePicture} />
                                    <AvatarFallback>
                                        {user.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold">{user.username}</h4>
                                    <p className="text-sm text-gray-500">{user.bio || 'No bio'}</p>
                                </div>
                            </div>
                        ))
                    )}
                    {!loading && searchQuery && searchResults.length === 0 && (
                        <div className="text-center text-gray-500">No users found</div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SearchDialog;