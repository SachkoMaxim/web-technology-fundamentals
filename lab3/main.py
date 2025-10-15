from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import Application, CallbackQueryHandler, CommandHandler, MessageHandler, filters
from groq import Groq

TG_TOKEN = "PASTE_YOUR_TELEGRAM_BOT_TOKEN_HERE"
GROQ_API_KEY = "PASTE_YOUR_GROQ_API_KEY_HERE"

application = Application.builder().token(TG_TOKEN).build()
chatbot = Groq(api_key=f"{GROQ_API_KEY}")

def main_menu_keyboard():
    keyboard = [
        [InlineKeyboardButton("🎓 Student Info", callback_data='student_info')],
        [InlineKeyboardButton("💻 IT-technologies", callback_data='it_technologies')],
        [InlineKeyboardButton("📞 Contacts", callback_data='contacts')],
        [InlineKeyboardButton("🤖 Groq Prompt", callback_data='groq_prompt')]
    ]
    return InlineKeyboardMarkup(keyboard)

def back_button_keyboard():
    keyboard = [[InlineKeyboardButton("⬅️ Back", callback_data='main_menu')]]

    return InlineKeyboardMarkup(keyboard)

async def start(update: Update, context):
    await update.message.reply_text(
        "A chatbot welcomes you. Please select an option for the appropriate action:",
        reply_markup=main_menu_keyboard()
    )

async def menu_handler(update: Update, context):
    query = update.callback_query
    await query.answer()

    if query.data == 'student_info':
        await query.edit_message_text(
            text="""
*🎓 Student information*

**📑 Surname:** ст. Name S. P.
**👥 Group:** AA-22
**🏫 Faculty:** Інформатики та обчислювальної техніки
**👨‍💻 Specialty:** Інженерія програмного забезпечення
**📅 Course:** 4
            """,
            reply_markup=back_button_keyboard(),
            parse_mode='Markdown'
        )
    elif query.data == 'it_technologies':
        await query.edit_message_text(
            text="""
*💻 IT-technologies*

**🖼️ Front-end:**
- HTML5, CSS3, JavaScript
- React.js

**⚙️ Back-end:**
- Node.js, Express.js
- Python

**🛠️ Instruments:**
- Git, GitHub
- Docker
- VS Code

**🏺 Other:**
- Android, Java, Kotlin
            """,
            reply_markup=back_button_keyboard(),
            parse_mode='Markdown'
        )
    elif query.data == 'contacts':
        await query.edit_message_text(
            text="""
*📞 Contacts*

**📱 Phone:** 111-111-11-11
**📧 Email:** maks07sim@gmail.com
**🗨️ Telegram:** @BL\\_OD
            """,
            reply_markup=back_button_keyboard(),
            parse_mode='Markdown'
        )
    elif query.data == 'groq_prompt':
        await query.edit_message_text(
            text="🤖 Please type your prompt for Groq:",
            reply_markup=back_button_keyboard()
        )
        # Save the message ID to edit later
        context.user_data['message_id'] = query.message.message_id

        # Save chat ID for context
        context.user_data['chat_id'] = query.message.chat_id

        # Set a state for user to input a Groq prompt next
        context.user_data['awaiting_groq'] = True
    elif query.data == 'main_menu':
        context.user_data['awaiting_groq'] = False
        await query.edit_message_text(
            text="Please choose an option:",
            reply_markup=main_menu_keyboard()
        )

async def handle_message(update: Update, context):
    if context.user_data.get('awaiting_groq'):
        await context.bot.send_chat_action(chat_id=update.effective_chat.id, action='typing')

        text = update.message.text

        chat_completion = chatbot.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": text,
                }
            ],
            model="llama-3.3-70b-versatile"
        )
        reply = chat_completion.choices[0].message.content

        sent_message = await context.bot.edit_message_text(
            text=f"*📨 Prompt:* {text}\n\n*🤖 Response:* {reply}",
            chat_id=context.user_data['chat_id'],
            message_id=context.user_data['message_id'],
            reply_markup=back_button_keyboard(),
            parse_mode='Markdown'
        )

        # Update message_id to reflect the new state after editing
        context.user_data['message_id'] = sent_message.message_id
    else:
        await update.message.reply_text("⚠️ Please use the menu to interact.")

application.add_handler(CommandHandler('start', start))
application.add_handler(CallbackQueryHandler(menu_handler))
application.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_message))

application.run_polling()
