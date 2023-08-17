//package com.jwtstudy.auth;
//
//@GetMapping("/{question_id}")
//public ResponseEntity getQuestion(@PathVariable("question_id") @Positive Long questionId) {
//        // 해당 질문에 달린 답변도 함께 조회
////        Question question = questionService.getQuestion(questionId);
////        QuestionResponseDTO questionResponseDTO = questionMapper.questionToQuestionResponseDTO(question);
////        return new ResponseEntity(questionResponseDTO, HttpStatus.OK);
//
//        Question question = questionService.getQuestion(questionId);
//        List<Answer> answerList = questionService.getQuestionAnswers(question);
//
//        QuestionResponseDTO questionResponseDTO = questionMapper.questionToQuestionResponseDTO(question);
//        List<AnswerResponseDTO> answerResponseDTOList = answerMapper.answerListToAnswerResponseDTOList(answerList);
//
//        for (AnswerResponseDTO answerResponseDTO : answerResponseDTOList) {
//        Answer answer = answerRepository.findById(answerResponseDTO.getAnswerId()).orElseThrow();
//        answerResponseDTO.setQuestionId(answer.getQuestion().getQuestionId());
//        }
//
//        return new ResponseEntity<>(new QuestionAnswersDTO<>(questionResponseDTO, answerResponseDTOList), HttpStatus.OK);
//        }
