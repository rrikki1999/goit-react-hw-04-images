// import React, { Component } from 'react';
import { requestImages } from '../api.js';
import { Searchbar } from './Searchbar';
import ImageGallery from './ImageGallery';
import { Button } from './Button.jsx';
import { Loader } from './Loader.jsx';
import { Modal } from './Modal.jsx';
import { useState } from 'react';
import { useEffect } from 'react';

const App = () =>{
  // state = {
  //   query: '',
  //   status: 'idle',
  //   page: 1,
  //   images: [],   
  //   totalPages: null,    
  //   isOpenModal: false,
  //   modalData: [],
  //   error: null,
  //   isLoadMore: false,
  // };

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [modalData, setModalData] = useState({});
  const [error, setError] = useState(null); 
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [prevPage, setPrevPage] = useState(1);
  const [prevQuery, setPrevQuery] = useState('');


  // componentDidUpdate(_, prevState) {
  //   const { page, query } = this.state;
  //   if (page !== prevState.page || prevState.query !== query) {
  //     this.fetchImages(query, page);
  //   }
  // }
  
  useEffect(() => {
    if (page !== prevPage || prevQuery !== query) {
      fetchImages(query, page);
    }
  }, [query, page]);
  
  // fetchImages = async (query, page) => {
  //   try {
  //     if (!this.state.query.trim()) {
  //       return;
  //     }

  //     this.setState({ isLoadMore: true });
  //     const { hits, totalHits } = await requestImages(query, page);

  //     if (hits.length === 0) {
  //       return alert('We did not find');
  //     }
  //     this.setState(prevState => ({
  //       images: [...prevState.images, ...hits],
  //       totalPages: page < Math.ceil(totalHits / 12),
  //       status: 'success',
        
  //     }));
  //   } catch (error) {
  //     console.error('Error fetching images:', error);
  //     this.setState({
  //       status: 'error',
  //       error: error.message,
        
  //     });
  //   } finally {
  //     this.setState({ isLoadMore: false });
  //   }
  // };

  // handleSubmit = query => {
  //   if (query === query) {
  //     return;
  //   }
  //   this.setState({ query: query, images: [], page: 1 });
    
  // };

 const fetchImages = async (query, page) => {
    try {
      if (!query.trim()) {
        return;
      }
  
      setIsLoadMore(true);
  
      const { hits, totalHits } = await requestImages(query, page);
  
      if (hits.length === 0) {
        return alert('We did not find');
      }
  
      setImages((prevState) => [...prevState.images, ...hits]);
      setTotalPages(page < Math.ceil(totalHits / 12));
    } catch (error) {
      console.error('Error fetching images:', error);
      setError(error.message);
    } finally {
      setIsLoadMore(false);
    }
  };
  


  const handleSubmit = (newQuery) => {
    if (newQuery === query) {
      return;
    }
    setQuery(newQuery);
    setImages([]);
    setPage(1);
  };

  //  const handleLoadMore = () => {
  //   this.setState(prevState => ({
  //     page: prevState.page + 1,
  //   }));
    
  // };
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  

  // handleOpenModal = (largeImageURL, tags) => {
  //   this.setState({
  //     modalData: { largeImageURL, tags },
  //     isOpenModal: true,
  //   });
  // };

  const handleOpenModal = (largeImageURL, tags) => {
    setModalData({ largeImageURL, tags });
    setIsOpenModal(true);
  };

  // handleCloseModal = () => {
  //   this.setState({
  //     isOpenModal: false,
  //   });
  // };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

 

    return (
      <div>
        <Searchbar onSubmit={handleSubmit} />
        {isLoadMore && <Loader />} 
        <ImageGallery images={images} onClickModal={handleOpenModal} />
        {isOpenModal && (
          <Modal
            isOpenModal={isOpenModal}
            onCloseModal={handleCloseModal}
            modalData={modalData}
          />
        )}
        { totalPages && !isLoadMore  && images.length > 0  && (
          <Button handleLoadMore={handleLoadMore} />
        )}

      </div>
    );
  }

export default App;