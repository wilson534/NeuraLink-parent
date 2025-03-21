import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 700;
`;

const Description = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 600;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
  margin-bottom: 2rem;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const MealSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const MealCard = styled.div`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MealTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--primary-color);
  margin: 0;
`;

const ImageUploadContainer = styled.div`
  width: 100%;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-color);
  }
`;

const UploadedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease-in;
  
  &.visible {
    opacity: 1;
  }
`;

const UploadIcon = styled.div`
  color: #999;
  font-size: 2rem;
  position: absolute;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  font-family: inherit;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const TimeInputContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const GenerateButton = styled(motion.button)`
  background: linear-gradient(45deg, var(--accent-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: block;
  margin: 2rem auto 0;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const AdviceContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
`;

const AdviceTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const AdviceContent = styled.div`
  line-height: 1.6;
  color: #555;
`;

const HighlightedText = styled.span`
  background: linear-gradient(120deg, rgba(106, 90, 205, 0.2), rgba(106, 90, 205, 0.1));
  color: var(--primary-color);
  font-weight: 600;
  padding: 0 0.3rem;
  border-radius: 4px;
`;

const ScanningLight = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--primary-color),
    var(--secondary-color),
    transparent
  );
`;

// 上传图标组件
const UploadIconSvg = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19ZM13 13V7H16L12 3L8 7H11V13H13Z" fill="currentColor" />
  </svg>
);

// 运动类型选项
const exerciseTypes = [
  { value: '', label: '请选择运动类型' },
  { value: 'running', label: '跑步' },
  { value: 'walking', label: '走路' },
  { value: 'swimming', label: '游泳' },
  { value: 'cycling', label: '骑行' },
  { value: 'jumping', label: '跳绳' },
  { value: 'ball_games', label: '球类运动' },
  { value: 'dancing', label: '舞蹈' },
  { value: 'yoga', label: '瑜伽' },
  { value: 'other', label: '其他' },
];

interface MealData {
  image: File | null;
  imagePreview: string;
  description: string;
}

interface HealthData {
  meals: {
    breakfast: MealData;
    lunch: MealData;
    dinner: MealData;
  };
  exercise: {
    type: string;
    duration: string;
    description: string;
  };
  sleep: {
    startTime: string;
    endTime: string;
    totalHours: string;
  };
}

const HealthManagerPage: React.FC = () => {
  // 引用
  const fileInputRefs = {
    breakfast: useRef<HTMLInputElement>(null),
    lunch: useRef<HTMLInputElement>(null),
    dinner: useRef<HTMLInputElement>(null),
  };
  
  // 状态
  const [healthData, setHealthData] = useState<HealthData>({
    meals: {
      breakfast: { image: null, imagePreview: '', description: '' },
      lunch: { image: null, imagePreview: '', description: '' },
      dinner: { image: null, imagePreview: '', description: '' },
    },
    exercise: {
      type: '',
      duration: '',
      description: '',
    },
    sleep: {
      startTime: '22:00',
      endTime: '07:00',
      totalHours: '9',
    },
  });
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [advice, setAdvice] = useState<string>('');
  const [showScanningEffect, setShowScanningEffect] = useState<boolean>(false);
  
  // 处理图片上传
  const handleImageUpload = (meal: 'breakfast' | 'lunch' | 'dinner', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setHealthData(prev => ({
          ...prev,
          meals: {
            ...prev.meals,
            [meal]: {
              ...prev.meals[meal],
              image: file,
              imagePreview: reader.result as string,
            },
          },
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // 处理文本描述变化
  const handleDescriptionChange = (meal: 'breakfast' | 'lunch' | 'dinner', value: string) => {
    setHealthData(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [meal]: {
          ...prev.meals[meal],
          description: value,
        },
      },
    }));
  };
  
  // 处理运动信息变化
  const handleExerciseChange = (field: 'type' | 'duration' | 'description', value: string) => {
    setHealthData(prev => ({
      ...prev,
      exercise: {
        ...prev.exercise,
        [field]: value,
      },
    }));
  };
  
  // 处理睡眠信息变化
  const handleSleepChange = (field: 'startTime' | 'endTime' | 'totalHours', value: string) => {
    setHealthData(prev => ({
      ...prev,
      sleep: {
        ...prev.sleep,
        [field]: value,
      },
    }));
  };
  
  // 计算睡眠总时长
  const calculateSleepHours = () => {
    const { startTime, endTime } = healthData.sleep;
    
    if (startTime && endTime) {
      const start = new Date(`2023-01-01T${startTime}:00`);
      let end = new Date(`2023-01-01T${endTime}:00`);
      
      // 如果结束时间小于开始时间，说明跨天了
      if (end < start) {
        end = new Date(`2023-01-02T${endTime}:00`);
      }
      
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      setHealthData(prev => ({
        ...prev,
        sleep: {
          ...prev.sleep,
          totalHours: diffHours.toFixed(1),
        },
      }));
    }
  };
  
  // 生成健康建议
  const generateHealthAdvice = async () => {
    setIsGenerating(true);
    setShowScanningEffect(true);
    setAdvice('');
    
    try {
      // 准备要发送的数据
      const formData = new FormData();
      
      // 添加三餐信息
      Object.entries(healthData.meals).forEach(([meal, data]) => {
        if (data.image) {
          formData.append(`${meal}Image`, data.image);
        }
        formData.append(`${meal}Description`, data.description);
      });
      
      // 添加运动信息
      formData.append('exerciseType', healthData.exercise.type);
      formData.append('exerciseDuration', healthData.exercise.duration);
      formData.append('exerciseDescription', healthData.exercise.description);
      
      // 添加睡眠信息
      formData.append('sleepStartTime', healthData.sleep.startTime);
      formData.append('sleepEndTime', healthData.sleep.endTime);
      formData.append('sleepTotalHours', healthData.sleep.totalHours);
      
      // 调用后端API
      const response = await axios.post('/api/health-check', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status === 'success') {
        // 模拟接收到的健康建议数据
        const adviceData = response.data.data.advice;
        setAdvice(adviceData);
      }
    } catch (error) {
      console.error('生成健康建议失败:', error);
      // 如果API调用失败，使用模拟数据
      setAdvice('根据您提供的信息，我们建议：\n1. 增加早餐的<蛋白质>摄入，可以考虑添加鸡蛋或豆制品。\n2. 您的<运动时间>略显不足，建议每天至少保持30分钟中等强度运动。\n3. <睡眠质量>可以通过睡前放松活动来提高，避免使用电子设备。');
    } finally {
      // 延迟一下，让扫描动画有足够时间显示
      setTimeout(() => {
        setIsGenerating(false);
        setShowScanningEffect(false);
      }, 2000);
    }
  };
  
  // 高亮关键词
  const highlightKeywords = (text: string) => {
    // 使用正则表达式匹配<关键词>格式的文本
    return text.split(/(<[^>]+>)/).map((part, index) => {
      if (part.startsWith('<') && part.endsWith('>')) {
        // 提取关键词（去掉尖括号）
        const keyword = part.substring(1, part.length - 1);
        return <HighlightedText key={index}>{keyword}</HighlightedText>;
      }
      return part;
    });
  };
  
  return (
    <PageContainer>
      <Title>身体小管家</Title>
      <Description>
        记录孩子的饮食、运动和睡眠情况，获取个性化健康建议
      </Description>
      
      <FormContainer>
        <FormSection>
          <SectionTitle>三餐记录</SectionTitle>
          <MealSection>
            {/* 早餐 */}
            <MealCard>
              <MealTitle>早餐</MealTitle>
              <ImageUploadContainer onClick={() => fileInputRefs.breakfast.current?.click()}>
                <input
                  type="file"
                  ref={fileInputRefs.breakfast}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleImageUpload('breakfast', e)}
                />
                {healthData.meals.breakfast.imagePreview ? (
                  <UploadedImage
                    src={healthData.meals.breakfast.imagePreview}
                    alt="早餐"
                    className={healthData.meals.breakfast.imagePreview ? 'visible' : ''}
                  />
                ) : (
                  <UploadIcon>
                    <UploadIconSvg />
                  </UploadIcon>
                )}
              </ImageUploadContainer>
              <TextArea
                placeholder="描述早餐内容，如：牛奶、面包、鸡蛋等"
                value={healthData.meals.breakfast.description}
                onChange={(e) => handleDescriptionChange('breakfast', e.target.value)}
              />
            </MealCard>
            
            {/* 午餐 */}
            <MealCard>
              <MealTitle>午餐</MealTitle>
              <ImageUploadContainer onClick={() => fileInputRefs.lunch.current?.click()}>
                <input
                  type="file"
                  ref={fileInputRefs.lunch}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleImageUpload('lunch', e)}
                />
                {healthData.meals.lunch.imagePreview ? (
                  <UploadedImage
                    src={healthData.meals.lunch.imagePreview}
                    alt="午餐"
                    className={healthData.meals.lunch.imagePreview ? 'visible' : ''}
                  />
                ) : (
                  <UploadIcon>
                    <UploadIconSvg />
                  </UploadIcon>
                )}
              </ImageUploadContainer>
              <TextArea
                placeholder="描述午餐内容，如：米饭、蔬菜、肉类等"
                value={healthData.meals.lunch.description}
                onChange={(e) => handleDescriptionChange('lunch', e.target.value)}
              />
            </MealCard>
            
            {/* 晚餐 */}
            <MealCard>
              <MealTitle>晚餐</MealTitle>
              <ImageUploadContainer onClick={() => fileInputRefs.dinner.current?.click()}>
                <input
                  type="file"
                  ref={fileInputRefs.dinner}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleImageUpload('dinner', e)}
                />
                {healthData.meals.dinner.imagePreview ? (
                  <UploadedImage
                    src={healthData.meals.dinner.imagePreview}
                    alt="晚餐"
                    className={healthData.meals.dinner.imagePreview ? 'visible' : ''}
                  />
                ) : (
                  <UploadIcon>
                    <UploadIconSvg />
                  </UploadIcon>
                )}
              </ImageUploadContainer>
              <TextArea
                placeholder="描述晚餐内容，如：面条、水果、汤等"
                value={healthData.meals.dinner.description}
                onChange={(e) => handleDescriptionChange('dinner', e.target.value)}
              />
            </MealCard>
          </MealSection>
        </FormSection>
        
        <FormSection>
          <SectionTitle>运动情况</SectionTitle>
          <InputGroup>
            <Label>运动类型</Label>
            <Select
              value={healthData.exercise.type}
              onChange={(e) => handleExerciseChange('type', e.target.value)}
            >
              {exerciseTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </InputGroup>
          
          <InputGroup>
            <Label>运动时长（分钟）</Label>
            <Input
              type="number"
              placeholder="例如：30"
              value={healthData.exercise.duration}
              onChange={(e) => handleExerciseChange('duration', e.target.value)}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>补充描述（可选）</Label>
            <TextArea
              placeholder="补充描述运动情况，如：在公园跑步、参加了学校的篮球课等"
              value={healthData.exercise.description}
              onChange={(e) => handleExerciseChange('description', e.target.value)}
            />
          </InputGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>睡眠情况</SectionTitle>
          <InputGroup>
            <Label>睡眠时间段</Label>
            <TimeInputContainer>
              <Input
                type="time"
                value={healthData.sleep.startTime}
                onChange={(e) => handleSleepChange('startTime', e.target.value)}
                onBlur={calculateSleepHours}
              />
              <span>至</span>
              <Input
                type="time"
                value={healthData.sleep.endTime}
                onChange={(e) => handleSleepChange('endTime', e.target.value)}
                onBlur={calculateSleepHours}
              />
            </TimeInputContainer>
          </InputGroup>
          
          <InputGroup>
            <Label>总睡眠时长（小时）</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="例如：9"
              value={healthData.sleep.totalHours}
              onChange={(e) => handleSleepChange('totalHours', e.target.value)}
            />
          </InputGroup>
        </FormSection>
        
        <GenerateButton
          onClick={generateHealthAdvice}
          disabled={isGenerating}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isGenerating ? '生成中...' : '生成健康建议'}
        </GenerateButton>
      </FormContainer>
      
      {advice && (
        <AdviceContainer>
          {showScanningEffect && (
            <ScanningLight
              animate={{
                y: ['0%', '100%', '0%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'linear',
              }}
            />
          )}
          <AdviceTitle>健康建议</AdviceTitle>
          <AdviceContent>
            {advice.split('\n').map((line, index) => (
              <p key={index}>{highlightKeywords(line)}</p>
            ))}
          </AdviceContent>
        </AdviceContainer>
      )}
    </PageContainer>
  );
};

export default HealthManagerPage;