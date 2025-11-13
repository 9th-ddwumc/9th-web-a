import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useState } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Modal = ({ isOpen, onClose }) => {
    const [lpName, setLpName] = useState('');
    const [lpContent, setLpContent] = useState('');
    const [tag, setTag] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [uploadImgUrl, setUploadImgUrl] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const resetForm = () => {
        setLpName("");
        setLpContent("");
        setTag("");
        setTags([]);
        setUploadImgUrl("");
    };

    // 태그 추가
    const addTag = () => {
        const isTrim = tag.trim();
        if (isTrim && !tags.includes(isTrim)) {
        setTags([...tags, isTrim]);
        }
        setTag("");
    };

    // 태그 삭제
    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    // 파일 선택
    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const rawToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
        const token = rawToken?.replace(/^"|"$/g, ""); // 따옴표 제거 (JSON.parse 제거)

        const uploadUrl = token
        ? "http://localhost:8000/v1/uploads"
        : "http://localhost:8000/v1/uploads/public";

        const headers: HeadersInit = {};
        if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        }

        try {
        const response = await fetch(uploadUrl, {
            method: "POST",
            headers,
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            setUploadImgUrl(result.data.imageUrl);
        } else {
            console.error(result.message);
        }
        } catch (e) {
        console.error(e);
        }
    };


    if (!isOpen) {
        return null;
    }

    // lp 생성
    

    return (

    );
};

export default Modal;