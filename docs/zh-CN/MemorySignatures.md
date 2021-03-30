# 内存签名与CE指南

内存签名是一种独一无二的二进制字符串，用于在程序运行中寻找其特定位置的内存地址。

找到这些签名后，即便游戏本身拒绝提供任何API，你也可以通过签名获取游戏状态。 (例如：是否处于战斗中，职业量谱的各种数值，仇恨数值的具体量等等)

这一篇指南旨在介绍如何使用CE(Cheat Engine)查找此类内存签名。 如果您了解一些基本的汇编语言或编程经验，并且有水滴石穿的耐心，那么这篇文章可能对您有一定的帮助。

## 目录

* [安装](#installation)
* [查找新的内存签名](#finding-new-memory-signatures)
  * [连接CE到游戏中](#connect-cheat-engine-to-the-game)
  * [初始内存搜索](#initial-memory-search)
  * [再次扫描](#repeated-scans)
  * [浏览内存](#browsing-memory)
  * [方法1：找出写内存的代码](#approach-1-finding-writers)
  * [方法2：跟踪](#approach-2-tracing)
  * [方法3：找出读内存的代码](#approach-3-finding-readers)
  * [汇编代码和指针](#assembly-code-and-pointers)
  * [从汇编代码中提取签名](#extracting-a-signature-from-assembly)
* [扫描现有的内存签名](#scan-for-existing-memory-signatures)

## 安装

安装最新版本的 [Cheat Engine](https://github.com/cheat-engine/cheat-engine/releases/latest)。 安装程序带了一些流氓软件，因此请确保不要勾选它们，不要盲目地一直“下一步”。 抱歉，  真的很流氓。

## 查找新的内存签名

![cheat engine screenshot](../../images/cheatengine_initial.png)

### 连接CE到游戏中

启动最终幻想14并登录。

然后，打开Cheat Engine。 点击 **文件**，选择 **打开进程**，然后选择最终幻想14的进程。

此时，顶部栏显示的应当是 **ffxiv_dx11.exe**。

![cheat engine connected screenshot](../../images/cheatengine_connected.png)

### 初始内存搜索

假设我们正在寻找您的角色在内存中的职业量谱。 为了简单起见，假设我们现在是一名战士，而我们正在寻找量谱中的兽魂值。 由于内存中存在许多零值，我们从一个非零值开始会简单一些。

在游戏中切换到战士职业，然后打几下木人，直到让你的兽魂值达到80。

切换到Cheat Engine。

![cheat engine initial scan screenshot](../../images/cheatengine_initialscan.png)

输入80的值（不要勾选十六进制）。 扫描类型应为 `精确值` ，数值类型应为 `4字节`。 此时，我们还不知道兽魂值占用了多少字节。 如果是4个字节最好了，因为要进行筛选的选项要少得多。 但是，我们目前还不能做这个假设。 我们也要寻找可写但不可执行的内存。

然后，单击 **首次扫描**。

这可能会为您提供一大堆值为80的内存地址。 但这是一个好的开端！

![cheat engine found screenshot](../../images/cheatengine_found.png)

这是所有这些内存地址的实时视图。 一旦值被更改就会变为红色。 其中一些值在不停地闪烁，即使我们完全没有在游戏中做任何事情，它们也在不断变化。 您可以多次使用 **再次扫描** 以重复扫描并舍弃这些值。

### 再次扫描

在游戏中使用裂石飞环使兽魂降低到30。

切换到Cheat Engine。 将 **数值** 更改为30。 单击 **再次扫描**。 这将大大减少内存地址的数量。

重复此过程，改变游戏中的兽魂值，然后重新扫描新的值，直到地址的数量降低到只有几个为止。

![cheat engine post scan screenshot](../../images/cheatengine_postscan.png)

其中，黑色的地址是堆地址。 而绿色的地址是 [静态地址](https://medium.com/@nickteixeira/stack-vs-heap-whats-the-difference-and-why-should-i-care-5abc78da1a88)。 在一般情况下，你应当使用静态地址。 因为引用它的代码更容易寻找，并且这些地址通常是永久性的。

继续扫描，直到找到唯一的绿色的静态地址。

右键单击地址，然后选择 **将选中的地址添加到地址列表**。 地址会出现在底部的列表。 在我们的例子里，这个静态地址是 `14116E128`。

![cheat engine address list screenshot](../../images/cheatengine_addresslist.png)

如果您正在按照此示例进行操作，则您所得到的静态地址很可能与此不同。 不仅如此，每次在您重新启动游戏时，这个地址都会变化。 这是因为Windows启用了 [地址空间布局随机化](https://en.wikipedia.org/wiki/Address_space_layout_randomization) ，很大程度上使得难以进行我们现在正在做的事情。

这也是我们需要找到内存签名的原因。 如果可执行文件和DLL地址布局没有随机化，则静态地址在每次运行时都是一致的。

### 浏览内存

在地址列表中，右键单击我们刚刚添加的地址，然后选择**浏览相关内存区域**。

这将会打开“内存浏览器”窗口。 此窗口的顶部是反汇编视图，底部是内存浏览器。 但是令人困惑的是，即使位于同一窗口中，这些视图的功能是互不干扰的，也 *不会* 同步。 它们在您使用 **反汇编此内存区域** 或 **浏览相关内存区域** 时跳转到您选择的最后一个地址。

![cheat engine browse memory screenshot](../../images/cheatengine_browsememory.png)

但是，您应当可以看到，这个屏幕截图的左上部的数值是十六进制的 `1E`，也就是 [十进制的30](https://www.google.com/search?q=0x1e+in+decimal)。

浏览内存使您看到周围的其他内容。 这对于诸如实体或玩家的数据等尤其有用。

对于职业数据，附近的内存确实没有什么有趣的。

### 方法1：找出写内存的代码

现在，我们需要找到一些与此地址相关的代码。 最简单的方式是找到修改此值的代码。

右键单击地址列表中的地址，然后选择 **找出是什么改写了这个地址**。 它会提示您附加调试器，单击“是”。 将会弹出一个新窗口。

返回到FF14，并改变兽魂的值。 在这种情况下，我们打出咆哮，让兽魂从30涨到80。

返回到Cheat Engine，调试窗口应出现一些新的信息。

![cheat engine debugger screenshot](../../images/cheatengine_debugger.png)

这是写入到兽魂内存地址的汇编代码。

需要的话，您可以单击 **显示反汇编器** 以查看周围的代码。

![cheat engine disassembly screenshot](../../images/cheatengine_disassembly.png)

不幸的是，在这个例子中，是两个操作数的函数调用。

更改值的一行汇编是 `mov [rcx + 08], al`。 我不是很了解汇编语言，但是谷歌老师告诉我 `al` 是 `eax` 寄存器的后8位，该寄存器的值是在前面的 `movzx eax, byte ptr [rdx+01]` 一行上设置的。 很明显这是写入内存的一行汇编，即 `[rcx + 08]` 是我们关心的指针，但我们需要先找到设置 `rcx`的值的代码。 这个寄存器的值在运行时会被设置多次。

我们在这里有两个不同的选择。 一个方式是 [进行跟踪以找到调用代码](#approach-2-tracing)。 第二种方式是 [考虑有什么读取了该地址](#approach-3-finding-readers) 而不仅仅看写入。 第三个方式（本指南中未探讨）是找到其他一些修改了值的代码栈，看看这个代码栈是否有更简单的签名。 （例如，切换职业会通过其他方式修改其值吗？）

### 方法2：跟踪

若仅仅依靠反汇编无法得知足够的上下文信息，则应当考虑CE的“断点跟踪”功能。 返回到[浏览内存](#browsing-memory)的视图。 此功能无法直接在地址列表中使用。

右键单击 `1E` 字节值。 选择 **数据断点**，然后点击 **中断和跟踪** 按钮。 选项都保持默认就可以了。 由于我们还在寻找写入此区域的代码，因此需要勾选 **写入时中断**。 点击 **确认**。

这将会打开跟踪窗口。 返回到FF14，并改变兽魂的值。 由于Cheat Engine会尝试记录函数调用栈，此时游戏很可能会很卡。 切换回跟踪窗口。

![cheat engine tracing screenshot](images/cheatengine_tracing.png)

双击跟踪窗口中的汇编代码会让内存浏览器的反汇编窗口跳转到该位置。

此时，我们可以点击三角箭头令其展开，并双击 `ret` (类似return) 汇编指令，让我们得以直通此前我们在反汇编窗口中看到的代码。

双击 `mov rdx, [rsp+50]` 则会导航至我们此前看的代码所调用的代码。

![cheat engine tracing 2 screenshot](images/cheatengine_tracing2.png)

这里的 `call` 正是我们正在寻找的 `call` 调用。 于是，接下来就是找到写入 `rcx` 的代码了。 可以看出来应该是通过 `r9` 赋值的。 而 `r9` 的值来自于存储于 `r14` 的指针。 这似乎有点复杂了。 尽管我们可以不停地检视汇编代码以找到对应的代码，但也许有更好的方式。

### 方法3：找出读内存的代码

寻找写入值的代码是一种方式，而另一种方式则是寻找读取值的代码。

右键选择地址列表中的内存地址，然后点击 **找出是什么访问了这个地址** 。

与改写不同的是，这个地址似乎被某段代码定期访问。 因此您需要在收集了足够的位置信息后按下 **停止** 按钮。

![cheat engine debugger 2 screenshot](images/cheatengine_debugger2.png)

在这个例子中，有两处代码访问了这块内存。 其中一个访问了3000余次之多，而另一个相对来说没有如此频繁，仅有152次。

通过检视反汇编的代码，我们可以发现第二行代码像是个更加翔实的函数，我们从这一个开始吧。

![cheat engine disassembly 2 screenshot](images/cheatengine_disassembly2.png)

太好了！ 这可比上一节的代码简单多了。

### 汇编代码和指针

由于我们寻找的是静态地址，在程序启动后就不会改变了。 我们的目标是找到包含了我们需要的地址的一些稳定的汇编代码。 于是，不管我们在哪里启动程序，我们都可以通过搜索这段内存代码找到该地址。

汇编代码中读取兽魂值的代码为 `movzx ebx, byte ptr [rcx+08]`。 用自然语言描述则是这样：它先读取 `rcx` 寄存器中存储的指针，向后移动8个字节，然后将该指针所指的地址中的值存储到 `ebx` 寄存器中。 (movzx 操作会对该值进行 [零扩展(zero extends)](https://www.felixcloutier.com/x86/movzx) 操作，尽管这不是我们所关心的。)

那么，我们现在就需要从 `rcx` 这个寄存器开始，向后搜寻赋值到 `rcx` 寄存器的代码行。 很快，您就能找到这一行： `mov rcx,[ffxiv_dx11.exe+1AAE118]`，设置了 `rcx` 的值。 这说明 `rcx` 的值来源于该内存地址所存储的值。

```assembly
48 8B 0D 23C14201     - mov rcx,[ffxiv_dx11.exe+1AAE118] { (14116E120) }
48 85 C9              - test rcx,rcx
74 B8                 - je ffxiv_dx11.exe+681FB2
48 8B 05 67C14201     - mov rax,[ffxiv_dx11.exe+1AAE168] { (21) }
```

换句话说，此处的 `23C14201` 的值就是我们要寻找的内存地址。 在此我简要介绍一下RIP相对寻址。 RIP relative addressing means that offsets are relative to the instruction pointer. The `RIP` register is the instruction pointer register and contains the address of the instruction immediately following this instruction. You can find out what this address is by double clicking on the next line (the `text rcx,rcx` line). In my case, it says the address is `13FD41FF5`. Because we are on a [little endian](https://en.wikipedia.org/wiki/Endianness) system, the `23C14201` hex is the 4 byte integer `01 42 C1 23` (bytes reversed). If you [add](https://www.google.com/search?q=0x0142C123+%2B+0x13FD41FF5) 0x0142C123 + 0x13FD41FF5, you get 0x14116E118. Cheat Engine will also calculate this number for you if you just double click on the instruction itself. For instance, double clicking on the `mov rcx` line yields the text `mov rcx,[14116E118]`. So, you don't have to do this math at all, but it's good to know how it works.

In the comment from Cheat Engine, that `mov rcx` line has the value `14116E120`. This means that the memory address at `14116E118` has the value `14116E120`. The memory address we found earlier when scanning was `14116E128`. So it makes sense that `14116E120 + 08` is the value we want, as the reading code adds 8 bytes to its address.

You can manually add `14116E118` to the memory region or just find it relative to the beast gauge, as it's very close.

![cheat engine pointer screenshot](images/cheatengine_pointer.png)

In the above screenshot, the small circle is the beast gauge values at `14116E128` and the longer circle is the pointer at `14116E118` that is being used to load `rcx`. This memory browsing confirms the comment earlier, that the memory at `14116E118` contains the pointer `000000014116E120`. (As always, little endian means reversing the bytes.)

### 从汇编代码中提取签名

So, now we have some assembly code that contains a pointer to a pointer to the beast gauge. We need to pick out some bytes from the assembly code to serve as the signature.

There's a little bit of an art to picking good signatures. You want to always want to ignore relative pointer offsets, like the `23C14201` value from before. These offsets will be the same from run to run, but change from patch to patch with great frequency. Finding signatures is a huge pain, so ideally you want to find something that will stand the test of time.

In this case, let's just start copying bytes out from the bytes column, starting with the `mov rcx, ...` line.

```assembly
48 8B 0D 23C14201     - mov rcx,[ffxiv_dx11.exe+1AAE118] { (14116E120) }
48 85 C9              - test rcx,rcx
74 B8                 - je ffxiv_dx11.exe+681FB2
48 8B 05 67C14201     - mov rax,[ffxiv_dx11.exe+1AAE168] { (21) }
```

This gives us: `48 8B 0D 23C14201 48 85 C9 74 B8 48 8B 05 67C14201`

The two four byte patterns are both pointers, so let's just drop the one on the end and make the internal one a wildcard. You can make wildcards using question marks, both in cactbot and in Cheat Engine.

Thus, our final signature is: `488B0D????????4885C974B8488B05`

The address that contains the pointer we care about is the four bytes in the question mark.

You can see this [in cactbot itself](https://github.com/quisquous/cactbot/blob/df176c4feff81bab356a8e5e6e6b453e94626320/CactbotOverlay/FFXIVProcess.cs#L189).

It's important to do a [scan for existing memory signatures](#scan-for-existing-memory-signatures) to make sure that this signature is unique.

Then, in your plugin, the process would be the following.

* search for this signature in memory
* convert the RIP relative addressing to a real pointer (e.g. `14116E118`)
* find the pointer at that memory location (e.g. `14116E120`)
* this pointer is the pointer to beast gauge

Because `14116E118` points 8 bytes forward to `14116E120`, we could just also make the assumption that this is always true and just add 16 bytes to what we find in the signature. This has been true through all of Stormblood, at least.

Foof.

## 扫描现有的内存签名

If you have an existing memory signature, you can also use Cheat Engine to find it in memory.

![cheat engine signature scan screenshot](images/cheatengine_signature_scan.png)

Start another scan. This time, set the **Value Type** to **Array of byte**, and select **Search for this array**. Click the **Hex** checkmark, and paste in the signature that we got previously. Make sure to click the **Executable** checkmark, as we are searching for code.

If you click **First scan**, this should find a single result. If you right click that address, and select **Disassemble this address** it will bring you right back to the code that we found previously.
