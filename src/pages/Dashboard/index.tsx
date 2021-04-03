import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

import api from '../../services/api';

import { FoodsContainer } from './styles';

export interface FoodItems {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
};

export function Dashboard () {
  const [foods, setFoods] = useState<FoodItems[]>([]);
  const [editingFood, setEditingFood] = useState<FoodItems>({} as FoodItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);


  const handleAddFood = async (food: FoodItems) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodItems) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: FoodItems) => {
    setEditingFood(food);
    setEditModalOpen(true);;
  }

  useEffect(() => {
    api.get('/foods').then((response) => setFoods(response.data));
  }, [])
  
  return (
    <>
    <Header openModal={toggleModal} />
    <ModalAddFood
      isOpen={modalOpen}
      setIsOpen={toggleModal}
      handleAddFood={handleAddFood}
    />
    <ModalEditFood
      isOpen={editModalOpen}
      setIsOpen={toggleEditModal}
      editingFood={editingFood}
      handleUpdateFood={handleUpdateFood}
    />

    <FoodsContainer data-testid="foods-list">
      {foods &&
        foods.map(food => (
          <Food
            key={food.id}
            food={food}
            handleDelete={handleDeleteFood}
            handleEditFood={handleEditFood}
          />
        ))}
    </FoodsContainer>
  </>
  );
}
